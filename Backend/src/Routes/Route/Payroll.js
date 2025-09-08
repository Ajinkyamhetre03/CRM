import express from 'express'
import { auth } from '../../middleware/auth.js'
import { checkRoleAndDepartment } from '../../middleware/roleCheck.js'
import User from '../../Models/User.js'
import Attendance from '../../Models/Attendance.js'
import Payroll from "../../Models/Payslip.js"
import mongoose from 'mongoose'

const router = express.Router()

// Auth checker
router.use(auth)
router.use(checkRoleAndDepartment(['manager'], ['financial']))

// Utility function to calculate working days in a month (excluding weekends)
const getWorkingDaysInMonth = (year, month) => {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)
  let workingDays = 0
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      workingDays++
    }
  }
  return workingDays
}

// Utility function to calculate session hours from attendance
const calculateSessionHours = (sessions) => {
  if (!sessions || sessions.length === 0) return 0
  
  let totalHours = 0
  sessions.forEach(session => {
    if (session.loginTime && session.logoutTime) {
      const loginTime = new Date(session.loginTime)
      const logoutTime = new Date(session.logoutTime)
      const diffInMs = logoutTime - loginTime
      const diffInHours = diffInMs / (1000 * 60 * 60)
      totalHours += diffInHours
    } else if (session.loginTime && session.status === 'active') {
      // If session is still active, calculate hours till now
      const loginTime = new Date(session.loginTime)
      const now = new Date()
      const diffInMs = now - loginTime
      const diffInHours = diffInMs / (1000 * 60 * 60)
      totalHours += diffInHours
    }
  })
  
  return Math.round(totalHours * 100) / 100
}

// Utility function to calculate pro-rated salary for new employees
const calculateProRatedSalary = (baseSalary, joiningDate, targetMonth, targetYear) => {
  const monthStart = new Date(targetYear, targetMonth - 1, 1)
  const monthEnd = new Date(targetYear, targetMonth, 0)
  
  let effectiveStart = joiningDate > monthStart ? joiningDate : monthStart
  let effectiveEnd = monthEnd
  
  const totalDaysInMonth = monthEnd.getDate()
  const workingDaysInMonth = getWorkingDaysInMonth(targetYear, targetMonth)
  
  // Calculate working days from joining date
  let workingDaysEligible = 0
  for (let date = new Date(effectiveStart); date <= effectiveEnd; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDaysEligible++
    }
  }
  
  return {
    proRatedSalary: (baseSalary * workingDaysEligible) / workingDaysInMonth,
    workingDaysEligible,
    workingDaysInMonth,
    isProRated: joiningDate > monthStart
  }
}

// Get all users with payroll summary
router.get('/users', async (req, res) => {
  try {
    const { 
      status = 'all',
      department, 
      month, 
      year, 
      search,
      page = 1,
      limit = 10
    } = req.query

    const currentDate = new Date()
    const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1
    const targetYear = year ? parseInt(year) : currentDate.getFullYear()

    // Build user filter
    let userFilter = { 
      role: { $nin: ['ceo', 'superadmin', 'admin'] },
      status: 'active'
    }
    
    if (department && department !== 'all') {
      userFilter.department = department
    }
    
    if (search) {
      userFilter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeCode: { $regex: search, $options: 'i' } }
      ]
    }

    // Get users with pagination
    const users = await User.find(userFilter)
      .select('username email department employeeCode Salary profileImage dateOfJoining')
      .sort({ username: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    // Get payroll data for each user
    const usersWithPayroll = await Promise.all(users.map(async (user) => {
      // Check if user joined after the target month
      const joiningDate = new Date(user.dateOfJoining)
      const targetMonthStart = new Date(targetYear, targetMonth - 1, 1)
      
      if (joiningDate > new Date(targetYear, targetMonth, 0)) {
        // User hasn't joined yet for this month
        return {
          ...user.toObject(),
          payrollStatus: 'not_eligible',
          reason: 'Employee not joined yet',
          presentDays: 0,
          lopDays: 0,
          totalDaysInMonth: 0,
          workingDays: 0,
          calculatedSalary: 0,
          totalWorkedHours: 0
        }
      }

      // Check if payroll exists for the month
      const payPeriod = `${new Date(targetYear, targetMonth - 1).toLocaleDateString('en-US', { month: 'long' })} ${targetYear}`
      
      const existingPayroll = await Payroll.findOne({
        employee: user._id,
        payPeriod: payPeriod
      })

      // Get attendance data for the month
      const startDate = new Date(targetYear, targetMonth - 1, 1)
      const endDate = new Date(targetYear, targetMonth, 0)
      
      const attendanceRecords = await Attendance.find({
        user: user._id,
        date: { $gte: startDate, $lte: endDate }
      })

      // Calculate working days and attendance
      const totalDaysInMonth = endDate.getDate()
      const workingDaysInMonth = getWorkingDaysInMonth(targetYear, targetMonth)
      
      // Count different types of days
      const presentRecords = attendanceRecords.filter(record => 
        ['full-day', 'half-day', 'remote'].includes(record.status)
      )
      const halfDayRecords = attendanceRecords.filter(record => 
        record.status === 'half-day'
      )
      const leaveRecords = attendanceRecords.filter(record => 
        ['on-leave', 'paid-leave', 'sick-leave'].includes(record.status)
      )

      // Calculate total worked hours from sessions
      let totalWorkedHours = 0
      attendanceRecords.forEach(record => {
        if (record.sessions && record.sessions.length > 0) {
          totalWorkedHours += calculateSessionHours(record.sessions)
        }
      })

      // Calculate actual working days
      const actualPresentDays = presentRecords.length - (halfDayRecords.length * 0.5)
      const paidLeaveDays = leaveRecords.length
      const totalPaidDays = actualPresentDays + paidLeaveDays
      
      // Calculate LOP (Loss of Pay) days
      const expectedWorkingDays = joiningDate > targetMonthStart ? 
        calculateProRatedSalary(user.Salary, joiningDate, targetMonth, targetYear).workingDaysEligible :
        workingDaysInMonth
      
      const lopDays = Math.max(0, expectedWorkingDays - totalPaidDays)

      // Calculate salary based on attendance and joining date
      let salaryCalculation
      if (joiningDate > targetMonthStart) {
        salaryCalculation = calculateProRatedSalary(user.Salary, joiningDate, targetMonth, targetYear)
      } else {
        salaryCalculation = {
          proRatedSalary: user.Salary * (totalPaidDays / workingDaysInMonth),
          workingDaysEligible: workingDaysInMonth,
          workingDaysInMonth,
          isProRated: false
        }
      }

      // Check for duplicate payroll (validation)
      const duplicatePayroll = await Payroll.countDocuments({
        employee: user._id,
        payPeriod: payPeriod
      })

      return {
        ...user.toObject(),
        payrollStatus: existingPayroll ? 'paid' : 'unpaid',
        payrollId: existingPayroll?._id,
        netPay: existingPayroll?.netPay || 0,
        payDate: existingPayroll?.payDate,
        presentDays: actualPresentDays,
        lopDays: Math.round(lopDays * 100) / 100,
        totalDaysInMonth,
        workingDays: expectedWorkingDays,
        calculatedSalary: Math.round(salaryCalculation.proRatedSalary * 100) / 100,
        baseSalary: user.Salary,
        isProRated: salaryCalculation.isProRated,
        totalWorkedHours: Math.round(totalWorkedHours * 100) / 100,
        duplicateCount: duplicatePayroll,
        eligibleWorkingDays: expectedWorkingDays,
        paidLeaveDays,
        joiningDate: user.dateOfJoining
      }
    }))

    // Filter by payment status
    let filteredUsers = usersWithPayroll
    if (status !== 'all') {
      filteredUsers = usersWithPayroll.filter(user => user.payrollStatus === status)
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(userFilter)

    res.json({
      success: true,
      data: filteredUsers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        limit: parseInt(limit)
      },
      summary: {
        totalUsers: usersWithPayroll.length,
        paidUsers: usersWithPayroll.filter(u => u.payrollStatus === 'paid').length,
        unpaidUsers: usersWithPayroll.filter(u => u.payrollStatus === 'unpaid').length,
        notEligibleUsers: usersWithPayroll.filter(u => u.payrollStatus === 'not_eligible').length,
        totalPayrollAmount: usersWithPayroll
          .filter(u => u.payrollStatus === 'paid')
          .reduce((sum, u) => sum + u.netPay, 0),
        duplicatePayrolls: usersWithPayroll.filter(u => u.duplicateCount > 1).length
      }
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    })
  }
})

// Generate/Create payroll for a user with extensive validations
router.post('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const {
      month,
      year,
      earnings = [],
      deductions = [],
      remarks,
      override = false,
      manualAttendanceOverride = false,
      manualPresentDays,
      manualLeaveDays
    } = req.body

    const currentDate = new Date()
    const targetMonth = month || currentDate.getMonth() + 1
    const targetYear = year || currentDate.getFullYear()
    
    // Get user details
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot generate payroll for inactive user'
      })
    }

    const payPeriod = `${new Date(targetYear, targetMonth - 1).toLocaleDateString('en-US', { month: 'long' })} ${targetYear}`
    
    // Validation: Check if user joined before or during the target month
    const joiningDate = new Date(user.dateOfJoining)
    const targetMonthEnd = new Date(targetYear, targetMonth, 0)
    
    if (joiningDate > targetMonthEnd) {
      return res.status(400).json({
        success: false,
        message: `Employee joined on ${joiningDate.toDateString()}, cannot generate payroll for ${payPeriod}`
      })
    }

    // Validation: Check for duplicate payroll
    const existingPayroll = await Payroll.findOne({
      employee: userId,
      payPeriod: payPeriod
    })

    if (existingPayroll && !override) {
      return res.status(400).json({
        success: false,
        message: 'Payroll already exists for this period. Use override flag to update.',
        data: existingPayroll
      })
    }

    // Validation: Prevent future month payroll (more than 1 month ahead)
    const futureLimit = new Date()
    futureLimit.setMonth(futureLimit.getMonth() + 1)
    const targetDate = new Date(targetYear, targetMonth - 1, 1)
    
    if (targetDate > futureLimit) {
      return res.status(400).json({
        success: false,
        message: 'Cannot generate payroll more than 1 month in advance'
      })
    }

    // Get attendance data
    const startDate = new Date(targetYear, targetMonth - 1, 1)
    const endDate = new Date(targetYear, targetMonth, 0)
    
    const attendanceRecords = await Attendance.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    })

    // Calculate working days and attendance
    const workingDaysInMonth = getWorkingDaysInMonth(targetYear, targetMonth)
    let presentDays, leaveDays, totalWorkedHours = 0

    if (manualAttendanceOverride && (manualPresentDays !== undefined || manualLeaveDays !== undefined)) {
      // HR manual override
      presentDays = manualPresentDays || 0
      leaveDays = manualLeaveDays || 0
    } else {
      // Calculate from attendance records
      const presentRecords = attendanceRecords.filter(record => 
        ['full-day', 'half-day', 'remote'].includes(record.status)
      )
      const halfDayRecords = attendanceRecords.filter(record => 
        record.status === 'half-day'
      )
      const leaveRecords = attendanceRecords.filter(record => 
        ['on-leave', 'paid-leave', 'sick-leave'].includes(record.status)
      )

      presentDays = presentRecords.length - (halfDayRecords.length * 0.5)
      leaveDays = leaveRecords.length

      // Calculate total worked hours from sessions
      attendanceRecords.forEach(record => {
        if (record.sessions && record.sessions.length > 0) {
          totalWorkedHours += calculateSessionHours(record.sessions)
        }
      })
    }

    // Calculate salary based on joining date and attendance
    let salaryCalculation
    if (joiningDate > startDate) {
      salaryCalculation = calculateProRatedSalary(user.Salary, joiningDate, targetMonth, targetYear)
    } else {
      const totalPaidDays = presentDays + leaveDays
      salaryCalculation = {
        proRatedSalary: user.Salary * (totalPaidDays / workingDaysInMonth),
        workingDaysEligible: workingDaysInMonth,
        workingDaysInMonth,
        isProRated: false
      }
    }

    const totalPaidDays = presentDays + leaveDays
    const lopDays = Math.max(0, salaryCalculation.workingDaysEligible - totalPaidDays)
    const basicSalary = salaryCalculation.proRatedSalary

    // Default earnings calculation
    const defaultEarnings = earnings.length > 0 ? earnings : [
      {
        type: 'Basic Salary',
        amount: Math.round(basicSalary * 100) / 100,
        ytdAmount: Math.round(basicSalary * targetMonth * 100) / 100
      },
      {
        type: 'HRA (40%)',
        amount: Math.round(basicSalary * 0.4 * 100) / 100,
        ytdAmount: Math.round(basicSalary * 0.4 * targetMonth * 100) / 100
      },
      {
        type: 'Transport Allowance',
        amount: Math.round(1600 * (totalPaidDays / workingDaysInMonth) * 100) / 100,
        ytdAmount: Math.round(1600 * targetMonth * 100) / 100
      }
    ]

    // Default deductions calculation
    const defaultDeductions = deductions.length > 0 ? deductions : [
      {
        type: 'EPF Employee (12%)',
        amount: Math.round(basicSalary * 0.12 * 100) / 100,
        ytdAmount: Math.round(basicSalary * 0.12 * targetMonth * 100) / 100
      },
      {
        type: 'Professional Tax',
        amount: totalPaidDays > 15 ? 200 : 0, // Pro-rated PT
        ytdAmount: 200 * targetMonth
      },
      {
        type: 'TDS (5%)',
        amount: Math.round(basicSalary * 0.05 * 100) / 100,
        ytdAmount: Math.round(basicSalary * 0.05 * targetMonth * 100) / 100
      }
    ]

    // Calculate totals
    const totalEarnings = defaultEarnings.reduce((sum, earning) => sum + earning.amount, 0)
    const totalDeductions = defaultDeductions.reduce((sum, deduction) => sum + deduction.amount, 0)
    const netPay = Math.round((totalEarnings - totalDeductions) * 100) / 100

    // Validation: Check if net pay is reasonable
    if (netPay < 0) {
      return res.status(400).json({
        success: false,
        message: 'Net pay cannot be negative. Please review deductions.',
        calculation: {
          totalEarnings,
          totalDeductions,
          netPay
        }
      })
    }

    if (netPay > user.Salary * 2) {
      return res.status(400).json({
        success: false,
        message: 'Net pay seems unusually high. Please verify calculations.',
        calculation: {
          baseSalary: user.Salary,
          calculatedNetPay: netPay
        }
      })
    }

    // Convert amount to words (simplified)
    const convertToWords = (amount) => {
      return `Rupees ${Math.floor(amount).toLocaleString('en-IN')} only`
    }

    const payrollData = {
      employee: userId,
      payPeriod,
      payDate: new Date(),
      paidDays: Math.round(totalPaidDays * 100) / 100,
      lopDays: Math.round(lopDays * 100) / 100,
      totalWorkedHours: Math.round(totalWorkedHours * 100) / 100,
      grossEarnings: Math.round(totalEarnings * 100) / 100,
      totalDeductions: Math.round(totalDeductions * 100) / 100,
      netPay,
      amountInWords: convertToWords(netPay),
      earnings: defaultEarnings,
      deductions: defaultDeductions,
      createdBy: req.user.userId,
      remarks: remarks || (salaryCalculation.isProRated ? 
        `Pro-rated salary for joining date: ${joiningDate.toDateString()}` : ''),
      isProRated: salaryCalculation.isProRated,
      manualOverride: manualAttendanceOverride,
      calculationDetails: {
        baseSalary: user.Salary,
        workingDaysInMonth: salaryCalculation.workingDaysInMonth,
        eligibleWorkingDays: salaryCalculation.workingDaysEligible,
        presentDays,
        leaveDays,
        lopDays: Math.round(lopDays * 100) / 100
      }
    }

    let payroll
    if (existingPayroll && override) {
      payroll = await Payroll.findByIdAndUpdate(
        existingPayroll._id,
        payrollData,
        { new: true }
      ).populate('employee', 'username email employeeCode department')
    } else {
      payroll = new Payroll(payrollData)
      await payroll.save()
      await payroll.populate('employee', 'username email employeeCode department')
    }

    res.json({
      success: true,
      message: existingPayroll ? 'Payroll updated successfully' : 'Payroll generated successfully',
      data: payroll,
      warnings: salaryCalculation.isProRated ? ['This is a pro-rated salary'] : []
    })

  } catch (error) {
    console.error('Error generating payroll:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate payroll',
      error: error.message
    })
  }
})

// Bulk payroll generation with validations
router.post('/bulk-generate', async (req, res) => {
  try {
    const { month, year, userIds, override = false } = req.body
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      })
    }

    const results = {
      successful: [],
      failed: [],
      skipped: []
    }

    for (const userId of userIds) {
      try {
        // Use the existing single payroll generation logic
        const response = await fetch(`/api/financial/users/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers.authorization
          },
          body: JSON.stringify({ month, year, override })
        })

        if (response.ok) {
          const result = await response.json()
          results.successful.push({
            userId,
            payroll: result.data
          })
        } else {
          const error = await response.json()
          results.failed.push({
            userId,
            error: error.message
          })
        }
      } catch (error) {
        results.failed.push({
          userId,
          error: error.message
        })
      }
    }

    res.json({
      success: true,
      message: `Bulk payroll generation completed. ${results.successful.length} successful, ${results.failed.length} failed`,
      data: results
    })

  } catch (error) {
    console.error('Error in bulk payroll generation:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process bulk payroll generation',
      error: error.message
    })
  }
})

// Payroll validation endpoint
router.post('/validate/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { month, year } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const validations = []
    const warnings = []

    // Check joining date
    const joiningDate = new Date(user.dateOfJoining)
    const targetMonthEnd = new Date(year, month, 0)
    
    if (joiningDate > targetMonthEnd) {
      validations.push({
        type: 'error',
        message: `Employee joined after the target month`
      })
    }

    // Check existing payroll
    const payPeriod = `${new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long' })} ${year}`
    const existingPayroll = await Payroll.findOne({
      employee: userId,
      payPeriod: payPeriod
    })

    if (existingPayroll) {
      warnings.push({
        type: 'warning',
        message: 'Payroll already exists for this period'
      })
    }

    // Check attendance data
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    
    const attendanceRecords = await Attendance.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    })

    if (attendanceRecords.length === 0) {
      warnings.push({
        type: 'warning',
        message: 'No attendance records found for this period'
      })
    }

    res.json({
      success: true,
      data: {
        validations,
        warnings,
        canGenerate: validations.length === 0
      }
    })

  } catch (error) {
    console.error('Error validating payroll:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to validate payroll',
      error: error.message
    })
  }
})

export default router