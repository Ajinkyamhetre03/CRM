// App.js - Fixed routing structure
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useAuth } from './Context/AuthContext.jsx'
import { FourSquare } from 'react-loading-indicators'

// Auth Components
import Login from './components/Pages/Auth/Login.jsx'

// Layout Components
import Layout from './components/Layout/Layout.jsx'
import Publiclayout from './components/Layout/Publiclayout.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'

// Common Pages
import Dashboard from './components/Pages/Common/Dashboard.jsx'
import Unauthorized from './components/Pages/Common/Unauthorized.jsx'

import Managertask from './components/Pages/Common/Tasks/Managertask.jsx'
import TaskEmployeeIntern from './components/Pages/Common/Tasks/TaskEmployeeIntern.jsx'
import ChatApp from './components/Pages/Common/ChatApp.jsx'
import Profile from './components/Pages/Common/Profile.jsx'
import Attendance from './components/Pages/Common/manageAttendance.jsx'

import HomePage from './components/Pages/public/HomePage.jsx'
import ContactPage from './components/Pages/public/ContactPage.jsx'
import AboutPage from './components/Pages/public/AboutPage.jsx'
import ServicePage from './components/Pages/public/ServicePage.jsx'
import PortfolioPage from './components/Pages/public/PortfolioPage.jsx'
import ResourcesPage from './components/Pages/public/ResourcesPage.jsx'
import CareersPage from './components/Pages/public/CareersPage.jsx'
import ProductsPage from './components/Pages/public/ProductsPage.jsx'

//Candidate Pages
import ConfirmHiring from './components/Pages/Candidate/ConfirmHiring.jsx'
import PaymentConfromation from './components/Pages/Candidate/PaymentConfromation.jsx'

// SuperAdmin Pages
import AllUsers from './components/Pages/SuperAdmin/AllUsers.jsx'
import SystemSettings from './components/Pages/SuperAdmin/SystemSettings.jsx'
import Analytics from './components/Pages/SuperAdmin/Analytics.jsx'
import Mail from './components/Pages/SuperAdmin/Mail.jsx'
import AuditLogs from './components/Pages/SuperAdmin/AuditLogs.jsx'
import BackupRestore from './components/Pages/SuperAdmin/BackupRestore.jsx'

// Admin Pages
import UserManagement from './components/Pages/Admin/UserManagement.jsx'
import DepartmentReports from './components/Pages/Admin/DepartmentReports.jsx'
import Settings from './components/Pages/Admin/Settings.jsx'
import EmployeeRecords from './components/Pages/Admin/EmployeeRecords.jsx'
import Permissions from './components/Pages/Admin/Permissions.jsx'

// CEO Pages
import CompanyOverview from './components/Pages/CEO/CompanyOverview.jsx'
import CeoFinancialReports from './components/Pages/CEO/FinancialReports.jsx'
import StrategicPlanning from './components/Pages/CEO/StrategicPlanning.jsx'
import BoardReports from './components/Pages/CEO/BoardReports.jsx'
import ExecutiveSettings from './components/Pages/CEO/ExecutiveSettings.jsx'

// HR Department Pages - Manager
import HRTeamManagement from './components/Pages/HR/Manager/TeamManagement.jsx'
import PaymentVerification from './components/Pages/HR/Manager/PaymentVerification.jsx'
import HRRecruitment from './components/Pages/HR/Manager/Recruitment.jsx'
import HREmployeeRelations from './components/Pages/HR/Manager/EmployeeRelations.jsx'
import HRPolicies from './components/Pages/HR/Manager/Policies.jsx'
import HRJobs from './components/Pages/HR/Manager/Job.jsx'
import Application from './components/Pages/HR/Manager/Application.jsx'
import HRTraining from './components/Pages/HR/Manager/Training.jsx'
import HRPerformance from './components/Pages/HR/Manager/Performance.jsx'
import HRReports from './components/Pages/HR/Manager/Reports.jsx'

// HR Department Pages - Employee
import HREmployeeDatabase from './components/Pages/HR/Employee/EmployeeDatabase.jsx'
import HRRecruitmentSupport from './components/Pages/HR/Employee/RecruitmentSupport.jsx'
import HRTrainingRecords from './components/Pages/HR/Employee/TrainingRecords.jsx'
import HRLeaveManagement from './components/Pages/HR/Employee/LeaveManagement.jsx'
import HRAnalytics from './components/Pages/HR/Employee/Analytics.jsx'

// HR Department Pages - Intern
import HRLearning from './components/Pages/HR/Intern/Learning.jsx'
import HRBasics from './components/Pages/HR/Intern/Basics.jsx'
import HRTimeLog from './components/Pages/HR/Intern/TimeLog.jsx'
import HRFeedback from './components/Pages/HR/Intern/Feedback.jsx'
import HRProgress from './components/Pages/HR/Intern/Progress.jsx'

// IoT Department Pages - Manager
import IoTTeamManagement from './components/Pages/IoT/Manager/TeamManagement.jsx'
import IoTDevices from './components/Pages/IoT/Manager/Devices.jsx'
import IoTProjects from './components/Pages/IoT/Manager/Projects.jsx'
import IoTSensorData from './components/Pages/IoT/Manager/SensorData.jsx'
import IoTMonitoring from './components/Pages/IoT/Manager/Monitoring.jsx'
import IoTMaintenance from './components/Pages/IoT/Manager/Maintenance.jsx'
import IoTAnalytics from './components/Pages/IoT/Manager/Analytics.jsx'

// IoT Department Pages - Employee
import IoTTesting from './components/Pages/IoT/Employee/Testing.jsx'
import IoTDataAnalysis from './components/Pages/IoT/Employee/DataAnalysis.jsx'
import IoTLogs from './components/Pages/IoT/Employee/Logs.jsx'
import IoTTimeTracking from './components/Pages/IoT/Employee/TimeTracking.jsx'
import IoTUpdates from './components/Pages/IoT/Employee/Updates.jsx'

// IoT Department Pages - Intern
import IoTLearning from './components/Pages/IoT/Intern/Learning.jsx'
import IoTDeviceBasics from './components/Pages/IoT/Intern/DeviceBasics.jsx'
import IoTSensorTraining from './components/Pages/IoT/Intern/SensorTraining.jsx'
import IoTTimeLog from './components/Pages/IoT/Intern/TimeLog.jsx'
import IoTFeedback from './components/Pages/IoT/Intern/Feedback.jsx'

// Software Department Pages - Manager
import SoftwareTeamManagement from './components/Pages/Software/Manager/TeamManagement.jsx'
import SoftwareProjects from './components/Pages/Software/Manager/Projects.jsx'
import SoftwareCodeReviews from './components/Pages/Software/Manager/CodeReviews.jsx'
import SoftwareSprints from './components/Pages/Software/Manager/Sprints.jsx'
import SoftwareBugs from './components/Pages/Software/Manager/Bugs.jsx'
import SoftwareDeployments from './components/Pages/Software/Manager/Deployments.jsx'
import SoftwarePerformance from './components/Pages/Software/Manager/Performance.jsx'

// Software Department Pages - Employee
import SoftwareTasks from './components/Pages/Software/Employee/Tasks.jsx'
import SoftwareRepository from './components/Pages/Software/Employee/Repository.jsx'
import SoftwareBugReports from './components/Pages/Software/Employee/BugReports.jsx'
import SoftwareTimeTracking from './components/Pages/Software/Employee/TimeTracking.jsx'
import SoftwareDocs from './components/Pages/Software/Employee/Docs.jsx'
import SoftwareTesting from './components/Pages/Software/Employee/Testing.jsx'

// Software Department Pages - Intern
import SoftwareLearning from './components/Pages/Software/Intern/Learning.jsx'
import SoftwareAssignedTasks from './components/Pages/Software/Intern/AssignedTasks.jsx'
import SoftwareReviewTraining from './components/Pages/Software/Intern/ReviewTraining.jsx'
import SoftwareTools from './components/Pages/Software/Intern/Tools.jsx'
import SoftwareTimeLog from './components/Pages/Software/Intern/TimeLog.jsx'
import SoftwareFeedback from './components/Pages/Software/Intern/Feedback.jsx'

// Financial Department Pages - Manager
import FinancialTeamManagement from './components/Pages/Financial/Manager/TeamManagement.jsx'
import FinancialBudgets from './components/Pages/Financial/Manager/Budgets.jsx'
import FinancialExpenses from './components/Pages/Financial/Manager/Expenses.jsx'
import FinancialAnalysis from './components/Pages/Financial/Manager/Analysis.jsx'
import FinancialAudit from './components/Pages/Financial/Manager/Audit.jsx'
import FinancialPayroll from './components/Pages/Financial/Manager/Payroll.jsx'
import FinancialReports from './components/Pages/Financial/Manager/Reports.jsx'

// Financial Department Pages - Employee
import FinancialTasks from './components/Pages/Financial/Employee/Tasks.jsx'
import FinancialExpenseTracking from './components/Pages/Financial/Employee/ExpenseTracking.jsx'
import FinancialBudgetAnalysis from './components/Pages/Financial/Employee/BudgetAnalysis.jsx'
import FinancialInvoices from './components/Pages/Financial/Employee/Invoices.jsx'
import FinancialData from './components/Pages/Financial/Employee/Data.jsx'
import FinancialAuditSupport from './components/Pages/Financial/Employee/AuditSupport.jsx'

// Financial Department Pages - Intern
import FinancialLearning from './components/Pages/Financial/Intern/Learning.jsx'
import FinancialAssignedTasks from './components/Pages/Financial/Intern/AssignedTasks.jsx'
import FinancialAccountingBasics from './components/Pages/Financial/Intern/AccountingBasics.jsx'
import FinancialExcelTraining from './components/Pages/Financial/Intern/ExcelTraining.jsx'
import FinancialTimeLog from './components/Pages/Financial/Intern/TimeLog.jsx'
import FinancialFeedback from './components/Pages/Financial/Intern/Feedback.jsx'

// Business Department Pages - Manager
import BusinessTeamManagement from './components/Pages/Business/Manager/TeamManagement.jsx'
import BusinessClients from './components/Pages/Business/Manager/Clients.jsx'
import BusinessSales from './components/Pages/Business/Manager/Sales.jsx'
import BusinessMarketAnalysis from './components/Pages/Business/Manager/MarketAnalysis.jsx'
import BusinessStrategy from './components/Pages/Business/Manager/Strategy.jsx'
import BusinessPartnerships from './components/Pages/Business/Manager/Partnerships.jsx'
import BusinessReports from './components/Pages/Business/Manager/Reports.jsx'

// Business Department Pages - Employee
import BusinessTasks from './components/Pages/Business/Employee/Tasks.jsx'
import BusinessClientComm from './components/Pages/Business/Employee/ClientComm.jsx'
import BusinessSalesSupport from './components/Pages/Business/Employee/SalesSupport.jsx'
import BusinessMarketResearch from './components/Pages/Business/Employee/MarketResearch.jsx'
import BusinessProposals from './components/Pages/Business/Employee/Proposals.jsx'
import BusinessLeads from './components/Pages/Business/Employee/Leads.jsx'

// Business Department Pages - Intern
import BusinessLearning from './components/Pages/Business/Intern/Learning.jsx'
import BusinessAssignedTasks from './components/Pages/Business/Intern/AssignedTasks.jsx'
import BusinessMarketTraining from './components/Pages/Business/Intern/MarketTraining.jsx'
import BusinessClientBasics from './components/Pages/Business/Intern/ClientBasics.jsx'
import BusinessTimeLog from './components/Pages/Business/Intern/TimeLog.jsx'
import BusinessFeedback from './components/Pages/Business/Intern/Feedback.jsx'

function App () {
  const { isAuthenticated, isLoading } = useAuth()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
        <FourSquare
          color='#acadac'
          size='medium'
          text='Loading...'
          textColor='#e76d6d'
        />
      </div>
    )
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Publiclayout />}>
          <Route index element={<HomePage />} />
          <Route path='about' element={<AboutPage />} />
          <Route path='service' element={<ServicePage />} />
          <Route path='portfolio' element={<PortfolioPage />} />
          <Route path='resources' element={<ResourcesPage />} />
          <Route path='contact' element={<ContactPage />} />
          <Route path='careers' element={<CareersPage />} />
          <Route path='products' element={<ProductsPage />} />
        </Route>
        {/* Candidate Routes */}
        <Route
          path='/applications/:applicationId/confirm-hiring/:token'
          element={<ConfirmHiring />}
        />
        <Route
          path='/applications/:applicationId/payment-details/:token'
          element={<PaymentConfromation />}
        />

        <Route
          path='/login'
          element={
            isAuthenticated ? (
              <Navigate to='/app/dashboard' replace />
            ) : (
              <Login />
            )
          }
        />
        <Route path='/unauthorized' element={<Unauthorized />} />

        {/* Protected Routes with Layout */}
        <Route
          path='/app'
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect to dashboard for authenticated users */}
          <Route index element={<Navigate to='/app/dashboard' replace />} />

          {/* Common Routes - All authenticated users */}
          <Route path='dashboard' element={<Dashboard />} />
          {import.meta.env.VITE_CHAT === 'true' && (
            <Route path='chat' element={<ChatApp />} />
          )}
          <Route path='profile' element={<Profile />} />
          <Route path='attendance' element={<Attendance />} />

          {/* SuperAdmin Routes */}
          <Route
            path='users'
            element={
              <ProtectedRoute requiredRole='superadmin'>
                <AllUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path='system-settings'
            element={
              <ProtectedRoute requiredRole='superadmin'>
                <SystemSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path='analytics'
            element={
              <ProtectedRoute requiredRole='superadmin'>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path='mail'
            element={
              <ProtectedRoute requiredRole='superadmin'>
                <Mail />
              </ProtectedRoute>
            }
          />
          <Route
            path='audit-logs'
            element={
              <ProtectedRoute requiredRole='superadmin'>
                <AuditLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path='backup'
            element={
              <ProtectedRoute requiredRole='superadmin'>
                <BackupRestore />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path='user-management'
            element={
              <ProtectedRoute requiredRole='admin'>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path='department-reports'
            element={
              <ProtectedRoute requiredRole='admin'>
                <DepartmentReports />
              </ProtectedRoute>
            }
          />
          <Route
            path='settings'
            element={
              <ProtectedRoute requiredRole='admin'>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path='employee-records'
            element={
              <ProtectedRoute requiredRole='admin'>
                <EmployeeRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path='permissions'
            element={
              <ProtectedRoute requiredRole='admin'>
                <Permissions />
              </ProtectedRoute>
            }
          />

          {/* CEO Routes */}
          <Route
            path='company-overview'
            element={
              <ProtectedRoute requiredRole='ceo'>
                <CompanyOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial-reports'
            element={
              <ProtectedRoute requiredRole='ceo'>
                <CeoFinancialReports />
              </ProtectedRoute>
            }
          />
          <Route
            path='strategic-planning'
            element={
              <ProtectedRoute requiredRole='ceo'>
                <StrategicPlanning />
              </ProtectedRoute>
            }
          />
          <Route
            path='board-reports'
            element={
              <ProtectedRoute requiredRole='ceo'>
                <BoardReports />
              </ProtectedRoute>
            }
          />
          <Route
            path='executive-settings'
            element={
              <ProtectedRoute requiredRole='ceo'>
                <ExecutiveSettings />
              </ProtectedRoute>
            }
          />

          {/* HR Department Routes */}
          {/* HR Manager Routes */}
          <Route
            path='hr/team-management'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='hr'>
                <HRTeamManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/managertasks'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='hr'>
                <Managertask />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/payment-verification'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='hr'>
                <PaymentVerification />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/recruitment'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='hr'>
                <HRRecruitment />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/employee-relations'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='hr'>
                <HREmployeeRelations />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/policies'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='hr'>
                <HRPolicies />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/jobs'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='hr'>
                <HRJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/application'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='hr'>
                <Application />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/training'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='hr'>
                <HRTraining />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/performance'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='hr'>
                <HRPerformance />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/reports'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='hr'>
                <HRReports />
              </ProtectedRoute>
            }
          />

          {/* HR Employee Routes */}
          <Route
            path='hr/employeetasks'
            element={
              <ProtectedRoute requiredRole='employee' requiredDepartment='hr'>
                <TaskEmployeeIntern />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/employee-database'
            element={
              <ProtectedRoute requiredRole='employee' requiredDepartment='hr'>
                <HREmployeeDatabase />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/recruitment-support'
            element={
              <ProtectedRoute requiredRole='employee' requiredDepartment='hr'>
                <HRRecruitmentSupport />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/training-records'
            element={
              <ProtectedRoute requiredRole='employee' requiredDepartment='hr'>
                <HRTrainingRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/leave-management'
            element={
              <ProtectedRoute requiredRole='employee' requiredDepartment='hr'>
                <HRLeaveManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/hr-analytics'
            element={
              <ProtectedRoute requiredRole='employee' requiredDepartment='hr'>
                <HRAnalytics />
              </ProtectedRoute>
            }
          />

          {/* HR Intern Routes */}
          <Route
            path='hr/learning'
            element={
              <ProtectedRoute requiredRole='intern' requiredDepartment='hr'>
                <HRLearning />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/interntasks'
            element={
              <ProtectedRoute requiredRole='intern' requiredDepartment='hr'>
                <TaskEmployeeIntern />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/basics'
            element={
              <ProtectedRoute requiredRole='intern' requiredDepartment='hr'>
                <HRBasics />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/time-log'
            element={
              <ProtectedRoute requiredRole='intern' requiredDepartment='hr'>
                <HRTimeLog />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/feedback'
            element={
              <ProtectedRoute requiredRole='intern' requiredDepartment='hr'>
                <HRFeedback />
              </ProtectedRoute>
            }
          />
          <Route
            path='hr/progress'
            element={
              <ProtectedRoute requiredRole='intern' requiredDepartment='hr'>
                <HRProgress />
              </ProtectedRoute>
            }
          />

          {/* IoT Department Routes */}
          {/* IoT Manager Routes */}
          <Route
            path='iot/team-management'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='iot'>
                <IoTTeamManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/devices'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='iot'>
                <IoTDevices />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/projects'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='iot'>
                <IoTProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/sensor-data'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='iot'>
                <IoTSensorData />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/monitoring'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='iot'>
                <IoTMonitoring />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/maintenance'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='iot'>
                <IoTMaintenance />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/analytics'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='iot'>
                <IoTAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/managertasks'
            element={
              <ProtectedRoute requiredRole='manager' requiredDepartment='iot'>
                <Managertask />
              </ProtectedRoute>
            }
          />

          {/* IoT Employee Routes */}
          <Route
            path='iot/employeetasks'
            element={
              <ProtectedRoute requiredRole='employee' requiredDepartment='iot'>
                <TaskEmployeeIntern />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/testing'
            element={
              <ProtectedRoute requiredRole='employee' requiredDepartment='iot'>
                <IoTTesting />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/data-analysis'
            element={
              <ProtectedRoute requiredRole='employee' requiredDepartment='iot'>
                <IoTDataAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/logs'
            element={
              <ProtectedRoute requiredRole='employee' requiredDepartment='iot'>
                <IoTLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/time-tracking'
            element={
              <ProtectedRoute requiredRole='employee' requiredDepartment='iot'>
                <IoTTimeTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/updates'
            element={
              <ProtectedRoute requiredRole='employee' requiredDepartment='iot'>
                <IoTUpdates />
              </ProtectedRoute>
            }
          />

          {/* IoT Intern Routes */}
          <Route
            path='iot/learning'
            element={
              <ProtectedRoute requiredRole='intern' requiredDepartment='iot'>
                <IoTLearning />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/interntasks'
            element={
              <ProtectedRoute requiredRole='intern' requiredDepartment='iot'>
                <TaskEmployeeIntern />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/device-basics'
            element={
              <ProtectedRoute requiredRole='intern' requiredDepartment='iot'>
                <IoTDeviceBasics />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/sensor-training'
            element={
              <ProtectedRoute requiredRole='intern' requiredDepartment='iot'>
                <IoTSensorTraining />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/time-log'
            element={
              <ProtectedRoute requiredRole='intern' requiredDepartment='iot'>
                <IoTTimeLog />
              </ProtectedRoute>
            }
          />
          <Route
            path='iot/feedback'
            element={
              <ProtectedRoute requiredRole='intern' requiredDepartment='iot'>
                <IoTFeedback />
              </ProtectedRoute>
            }
          />

          {/* Software Department Routes */}
          {/* Software Manager Routes */}
          <Route
            path='software/team-management'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='software'
              >
                <SoftwareTeamManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/managertasks'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='software'
              >
                <Managertask />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/projects'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='software'
              >
                <SoftwareProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/code-reviews'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='software'
              >
                <SoftwareCodeReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/sprints'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='software'
              >
                <SoftwareSprints />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/bugs'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='software'
              >
                <SoftwareBugs />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/deployments'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='software'
              >
                <SoftwareDeployments />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/performance'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='software'
              >
                <SoftwarePerformance />
              </ProtectedRoute>
            }
          />

          {/* Software Employee Routes */}
          <Route
            path='software/employeetasks'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='software'
              >
                <TaskEmployeeIntern />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/tasks'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='software'
              >
                <SoftwareTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/repository'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='software'
              >
                <SoftwareRepository />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/bug-reports'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='software'
              >
                <SoftwareBugReports />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/time-tracking'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='software'
              >
                <SoftwareTimeTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/docs'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='software'
              >
                <SoftwareDocs />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/testing'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='software'
              >
                <SoftwareTesting />
              </ProtectedRoute>
            }
          />

          {/* Software Intern Routes */}
          <Route
            path='software/learning'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='software'
              >
                <SoftwareLearning />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/interntasks'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='software'
              >
                <TaskEmployeeIntern />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/assigned-tasks'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='software'
              >
                <SoftwareAssignedTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/review-training'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='software'
              >
                <SoftwareReviewTraining />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/tools'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='software'
              >
                <SoftwareTools />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/time-log'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='software'
              >
                <SoftwareTimeLog />
              </ProtectedRoute>
            }
          />
          <Route
            path='software/feedback'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='software'
              >
                <SoftwareFeedback />
              </ProtectedRoute>
            }
          />

          {/* Financial Department Routes */}
          {/* Financial Manager Routes */}
          <Route
            path='financial/managertasks'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='financial'
              >
                <Managertask />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/team-management'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='financial'
              >
                <FinancialTeamManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/budgets'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='financial'
              >
                <FinancialBudgets />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/expenses'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='financial'
              >
                <FinancialExpenses />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/analysis'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='financial'
              >
                <FinancialAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/audit'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='financial'
              >
                <FinancialAudit />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/payroll'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='financial'
              >
                <FinancialPayroll />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/reports'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='financial'
              >
                <FinancialReports />
              </ProtectedRoute>
            }
          />

          {/* Financial Employee Routes */}
          <Route
            path='financial/employeetasks'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='financial'
              >
                <TaskEmployeeIntern />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/tasks'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='financial'
              >
                <FinancialTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/expense-tracking'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='financial'
              >
                <FinancialExpenseTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/budget-analysis'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='financial'
              >
                <FinancialBudgetAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/invoices'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='financial'
              >
                <FinancialInvoices />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/data'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='financial'
              >
                <FinancialData />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/audit-support'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='financial'
              >
                <FinancialAuditSupport />
              </ProtectedRoute>
            }
          />

          {/* Financial Intern Routes */}
          <Route
            path='financial/learning'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='financial'
              >
                <FinancialLearning />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/assigned-tasks'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='financial'
              >
                <FinancialAssignedTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/interntasks'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='financial'
              >
                <TaskEmployeeIntern />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/accounting-basics'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='financial'
              >
                <FinancialAccountingBasics />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/excel-training'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='financial'
              >
                <FinancialExcelTraining />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/time-log'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='financial'
              >
                <FinancialTimeLog />
              </ProtectedRoute>
            }
          />
          <Route
            path='financial/feedback'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='financial'
              >
                <FinancialFeedback />
              </ProtectedRoute>
            }
          />

          {/* Business Department Routes */}
          {/* Business Manager Routes */}
          <Route
            path='business/managertasks'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='business'
              >
                <Managertask />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/team-management'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='business'
              >
                <BusinessTeamManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/clients'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='business'
              >
                <BusinessClients />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/sales'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='business'
              >
                <BusinessSales />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/market-analysis'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='business'
              >
                <BusinessMarketAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/strategy'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='business'
              >
                <BusinessStrategy />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/partnerships'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='business'
              >
                <BusinessPartnerships />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/reports'
            element={
              <ProtectedRoute
                requiredRole='manager'
                requiredDepartment='business'
              >
                <BusinessReports />
              </ProtectedRoute>
            }
          />

          {/* Business Employee Routes */}
          <Route
            path='business/employeetasks'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='business'
              >
                <TaskEmployeeIntern />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/tasks'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='business'
              >
                <BusinessTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/client-comm'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='business'
              >
                <BusinessClientComm />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/sales-support'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='business'
              >
                <BusinessSalesSupport />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/market-research'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='business'
              >
                <BusinessMarketResearch />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/proposals'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='business'
              >
                <BusinessProposals />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/leads'
            element={
              <ProtectedRoute
                requiredRole='employee'
                requiredDepartment='business'
              >
                <BusinessLeads />
              </ProtectedRoute>
            }
          />

          {/* Business Intern Routes */}
          <Route
            path='business/interntasks'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='business'
              >
                <TaskEmployeeIntern />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/learning'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='business'
              >
                <BusinessLearning />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/assigned-tasks'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='business'
              >
                <BusinessAssignedTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/market-training'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='business'
              >
                <BusinessMarketTraining />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/client-basics'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='business'
              >
                <BusinessClientBasics />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/time-log'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='business'
              >
                <BusinessTimeLog />
              </ProtectedRoute>
            }
          />
          <Route
            path='business/feedback'
            element={
              <ProtectedRoute
                requiredRole='intern'
                requiredDepartment='business'
              >
                <BusinessFeedback />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback for undefined routes */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/app/dashboard" : "/login"} replace />} />
      </Routes>

      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        toastClassName={() =>
          'relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-white dark:bg-gray-800 shadow-lg'
        }
        bodyClassName={() => 'text-sm font-white block p-3'}
      />
    </>
  )
}

export default App
