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

// Get all users with payroll summary
router.get('/users', async (req, res) => {
  try {
    const { 
      status = 'all', // all, paid, unpaid, pending
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

      // Calculate working days and present days
      const totalDaysInMonth = endDate.getDate()
      const presentDays = attendanceRecords.filter(record => 
        ['full-day', 'half-day', 'remote'].includes(record.status)
      ).length
      const halfDays = attendanceRecords.filter(record => 
        record.status === 'half-day'
      ).length
      const lopDays = Math.max(0, totalDaysInMonth - presentDays - (halfDays * 0.5))

      return {
        ...user.toObject(),
        payrollStatus: existingPayroll ? 'paid' : 'unpaid',
        payrollId: existingPayroll?._id,
        netPay: existingPayroll?.netPay || 0,
        payDate: existingPayroll?.payDate,
        presentDays,
        lopDays: Math.round(lopDays * 100) / 100,
        totalDaysInMonth,
        workingDays: totalDaysInMonth - lopDays,
        calculatedSalary: user.Salary * ((totalDaysInMonth - lopDays) / totalDaysInMonth)
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
        totalPayrollAmount: usersWithPayroll
          .filter(u => u.payrollStatus === 'paid')
          .reduce((sum, u) => sum + u.netPay, 0)
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

// Get detailed payroll info for a specific user
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { month, year } = req.query

    const currentDate = new Date()
    const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1
    const targetYear = year ? parseInt(year) : currentDate.getFullYear()

    // Get user details
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Get attendance data for the month
    const startDate = new Date(targetYear, targetMonth - 1, 1)
    const endDate = new Date(targetYear, targetMonth, 0)
    
    const attendanceRecords = await Attendance.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 })

    // Calculate attendance summary
    const totalDaysInMonth = endDate.getDate()
    const presentDays = attendanceRecords.filter(record => 
      ['full-day', 'half-day', 'remote'].includes(record.status)
    ).length
    const halfDays = attendanceRecords.filter(record => 
      record.status === 'half-day'
    ).length
    const absentDays = attendanceRecords.filter(record => 
      record.status === 'absent'
    ).length
    const leaveDays = attendanceRecords.filter(record => 
      ['on-leave', 'paid-leave', 'sick-leave'].includes(record.status)
    ).length
    
    const actualWorkingDays = presentDays - (halfDays * 0.5)
    const lopDays = Math.max(0, totalDaysInMonth - actualWorkingDays - leaveDays)

    // Check existing payroll
    const payPeriod = `${new Date(targetYear, targetMonth - 1).toLocaleDateString('en-US', { month: 'long' })} ${targetYear}`
    const existingPayroll = await Payroll.findOne({
      employee: userId,
      payPeriod: payPeriod
    }).populate('employee', 'username email employeeCode')

    // Get payroll history
    const payrollHistory = await Payroll.find({
      employee: userId
    }).sort({ payDate: -1 }).limit(6)

    res.json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          attendance: {
            totalDaysInMonth,
            presentDays,
            halfDays,
            absentDays,
            leaveDays,
            lopDays: Math.round(lopDays * 100) / 100,
            actualWorkingDays: Math.round(actualWorkingDays * 100) / 100,
            attendancePercentage: Math.round((actualWorkingDays / totalDaysInMonth) * 100)
          }
        },
        currentPayroll: existingPayroll,
        payrollHistory,
        attendanceRecords
      }
    })

  } catch (error) {
    console.error('Error fetching user payroll:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user payroll data',
      error: error.message
    })
  }
})

// Generate/Create payroll for a user
router.post('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const {
      month,
      year,
      earnings = [],
      deductions = [],
      remarks,
      override = false
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

    const payPeriod = `${new Date(targetYear, targetMonth - 1).toLocaleDateString('en-US', { month: 'long' })} ${targetYear}`
    
    // Check if payroll already exists
    const existingPayroll = await Payroll.findOne({
      employee: userId,
      payPeriod: payPeriod
    })

    if (existingPayroll && !override) {
      return res.status(400).json({
        success: false,
        message: 'Payroll already exists for this period',
        data: existingPayroll
      })
    }

    // Get attendance data
    const startDate = new Date(targetYear, targetMonth - 1, 1)
    const endDate = new Date(targetYear, targetMonth, 0)
    
    const attendanceRecords = await Attendance.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    })

    // Calculate working days
    const totalDaysInMonth = endDate.getDate()
    const presentDays = attendanceRecords.filter(record => 
      ['full-day', 'half-day', 'remote'].includes(record.status)
    ).length
    const halfDays = attendanceRecords.filter(record => 
      record.status === 'half-day'
    ).length
    const leaveDays = attendanceRecords.filter(record => 
      ['on-leave', 'paid-leave', 'sick-leave'].includes(record.status)
    ).length

    const actualWorkingDays = presentDays - (halfDays * 0.5)
    const paidDays = Math.round((actualWorkingDays + leaveDays) * 100) / 100
    const lopDays = Math.max(0, totalDaysInMonth - paidDays)

    // Calculate salary components
    const basicSalary = user.Salary
    const dailySalary = basicSalary / totalDaysInMonth
    const grossSalary = basicSalary * (paidDays / totalDaysInMonth)

    // Default earnings if not provided
    const defaultEarnings = earnings.length > 0 ? earnings : [
      {
        type: 'Basic Salary',
        amount: Math.round(grossSalary * 100) / 100,
        ytdAmount: Math.round(grossSalary * targetMonth * 100) / 100
      },
      {
        type: 'HRA',
        amount: Math.round(grossSalary * 0.4 * 100) / 100,
        ytdAmount: Math.round(grossSalary * 0.4 * targetMonth * 100) / 100
      },
      {
        type: 'Transport Allowance',
        amount: Math.round(1600 * (paidDays / totalDaysInMonth) * 100) / 100,
        ytdAmount: Math.round(1600 * targetMonth * 100) / 100
      }
    ]

    // Default deductions if not provided
    const defaultDeductions = deductions.length > 0 ? deductions : [
      {
        type: 'EPF Employee',
        amount: Math.round(grossSalary * 0.12 * 100) / 100,
        ytdAmount: Math.round(grossSalary * 0.12 * targetMonth * 100) / 100
      },
      {
        type: 'Professional Tax',
        amount: 200,
        ytdAmount: 200 * targetMonth
      },
      {
        type: 'TDS',
        amount: Math.round(grossSalary * 0.05 * 100) / 100,
        ytdAmount: Math.round(grossSalary * 0.05 * targetMonth * 100) / 100
      }
    ]

    // Calculate totals
    const totalEarnings = defaultEarnings.reduce((sum, earning) => sum + earning.amount, 0)
    const totalDeductions = defaultDeductions.reduce((sum, deduction) => sum + deduction.amount, 0)
    const netPay = Math.round((totalEarnings - totalDeductions) * 100) / 100

    // Convert amount to words (simplified)
    const convertToWords = (amount) => {
      // This is a simplified version - you might want to use a proper library
      return `Rupees ${Math.floor(amount).toLocaleString('en-IN')} only`
    }

    const payrollData = {
      employee: userId,
      payPeriod,
      payDate: new Date(),
      paidDays,
      lopDays,
      grossEarnings: Math.round(totalEarnings * 100) / 100,
      totalDeductions: Math.round(totalDeductions * 100) / 100,
      netPay,
      amountInWords: convertToWords(netPay),
      earnings: defaultEarnings,
      deductions: defaultDeductions,
      createdBy: req.user.userId,
      remarks
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
      data: payroll
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

// Update payroll
router.put('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { payrollId, earnings, deductions, remarks } = req.body

    const payroll = await Payroll.findById(payrollId)
    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll not found'
      })
    }

    if (payroll.employee.toString() !== userId) {
      return res.status(400).json({
        success: false,
        message: 'Payroll does not belong to this user'
      })
    }

    // Update earnings and deductions
    if (earnings) payroll.earnings = earnings
    if (deductions) payroll.deductions = deductions
    if (remarks !== undefined) payroll.remarks = remarks

    // Recalculate totals
    const totalEarnings = payroll.earnings.reduce((sum, earning) => sum + earning.amount, 0)
    const totalDeductions = payroll.deductions.reduce((sum, deduction) => sum + deduction.amount, 0)
    
    payroll.grossEarnings = Math.round(totalEarnings * 100) / 100
    payroll.totalDeductions = Math.round(totalDeductions * 100) / 100
    payroll.netPay = Math.round((totalEarnings - totalDeductions) * 100) / 100

    await payroll.save()
    await payroll.populate('employee', 'username email employeeCode department')

    res.json({
      success: true,
      message: 'Payroll updated successfully',
      data: payroll
    })

  } catch (error) {
    console.error('Error updating payroll:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update payroll',
      error: error.message
    })
  }
})

// Delete payroll
router.delete('/payroll/:payrollId', async (req, res) => {
  try {
    const { payrollId } = req.params

    const payroll = await Payroll.findById(payrollId)
    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll not found'
      })
    }

    await Payroll.findByIdAndDelete(payrollId)

    res.json({
      success: true,
      message: 'Payroll deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting payroll:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete payroll',
      error: error.message
    })
  }
})

// Get payroll statistics
router.get('/statistics', async (req, res) => {
  try {
    const { year } = req.query
    const targetYear = year ? parseInt(year) : new Date().getFullYear()

    // Monthly payroll stats
    const monthlyStats = await Payroll.aggregate([
      {
        $match: {
          payDate: {
            $gte: new Date(targetYear, 0, 1),
            $lt: new Date(targetYear + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$payDate' },
          totalPayroll: { $sum: '$netPay' },
          employeeCount: { $sum: 1 },
          averageSalary: { $avg: '$netPay' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ])

    // Department-wise stats
    const departmentStats = await Payroll.aggregate([
      {
        $match: {
          payDate: {
            $gte: new Date(targetYear, 0, 1),
            $lt: new Date(targetYear + 1, 0, 1)
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'employee',
          foreignField: '_id',
          as: 'employeeData'
        }
      },
      {
        $unwind: '$employeeData'
      },
      {
        $group: {
          _id: '$employeeData.department',
          totalPayroll: { $sum: '$netPay' },
          employeeCount: { $sum: 1 },
          averageSalary: { $avg: '$netPay' }
        }
      }
    ])

    // Overall stats
    const overallStats = await Payroll.aggregate([
      {
        $match: {
          payDate: {
            $gte: new Date(targetYear, 0, 1),
            $lt: new Date(targetYear + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalPayroll: { $sum: '$netPay' },
          totalEmployees: { $sum: 1 },
          averageSalary: { $avg: '$netPay' },
          highestSalary: { $max: '$netPay' },
          lowestSalary: { $min: '$netPay' }
        }
      }
    ])

    res.json({
      success: true,
      data: {
        monthly: monthlyStats,
        department: departmentStats,
        overall: overallStats[0] || {
          totalPayroll: 0,
          totalEmployees: 0,
          averageSalary: 0,
          highestSalary: 0,
          lowestSalary: 0
        }
      }
    })

  } catch (error) {
    console.error('Error fetching statistics:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    })
  }
})

export default router