// App.js - Fixed routing structure
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAuth } from './Context/AuthContext';
import { FourSquare } from 'react-loading-indicators';

// Auth Components
import Login from './components/Pages/Auth/Login';

// Layout Components
import Layout from './components/Layout/Layout';
import Publiclayout from './components/Layout/Publiclayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Common Pages
import Dashboard from './components/Pages/Common/Dashboard';
import Unauthorized from './components/Pages/Common/Unauthorized';

import HomePage from './components/Pages/public/HomePage'
import ContactPage from './components/Pages/public/ContactPage'
import AboutPage from './components/Pages/public/AboutPage'
import ServicePage from './components/Pages/public/ServicePage'
import PortfolioPage from './components/Pages/public/PortfolioPage'
import ResourcesPage from './components/Pages/public/ResourcesPage'
import CareersPage from './components/Pages/public/CareersPage'


import ConfirmHiring from './components/Pages/Candidate/ConfirmHiring.jsx'

// SuperAdmin Pages
import AllUsers from './components/Pages/SuperAdmin/AllUsers';
import SystemSettings from './components/Pages/SuperAdmin/SystemSettings';
import Analytics from './components/Pages/SuperAdmin/Analytics';
import AuditLogs from './components/Pages/SuperAdmin/AuditLogs';
import BackupRestore from './components/Pages/SuperAdmin/BackupRestore';

// Admin Pages
import UserManagement from './components/Pages/Admin/UserManagement';
import DepartmentReports from './components/Pages/Admin/DepartmentReports';
import Settings from './components/Pages/Admin/Settings';
import EmployeeRecords from './components/Pages/Admin/EmployeeRecords';
import Permissions from './components/Pages/Admin/Permissions';

// CEO Pages
import CompanyOverview from './components/Pages/CEO/CompanyOverview';
import CeoFinancialReports from './components/Pages/CEO/FinancialReports';
import StrategicPlanning from './components/Pages/CEO/StrategicPlanning';
import BoardReports from './components/Pages/CEO/BoardReports';
import ExecutiveSettings from './components/Pages/CEO/ExecutiveSettings';

// HR Department Pages - Manager
import HRTeamManagement from './components/Pages/HR/Manager/TeamManagement';
import HRRecruitment from './components/Pages/HR/Manager/Recruitment';
import HREmployeeRelations from './components/Pages/HR/Manager/EmployeeRelations';
import HRPolicies from './components/Pages/HR/Manager/Policies';
import HRJobs from './components/Pages/HR/Manager/Job';
import Application from './components/Pages/HR/Manager/Application.jsx';
import HRTraining from './components/Pages/HR/Manager/Training';
import HRPerformance from './components/Pages/HR/Manager/Performance';
import HRReports from './components/Pages/HR/Manager/Reports';

// HR Department Pages - Employee
import HRTasks from './components/Pages/HR/Employee/Tasks';
import HREmployeeDatabase from './components/Pages/HR/Employee/EmployeeDatabase';
import HRRecruitmentSupport from './components/Pages/HR/Employee/RecruitmentSupport';
import HRTrainingRecords from './components/Pages/HR/Employee/TrainingRecords';
import HRLeaveManagement from './components/Pages/HR/Employee/LeaveManagement';
import HRAnalytics from './components/Pages/HR/Employee/Analytics';

// HR Department Pages - Intern
import HRLearning from './components/Pages/HR/Intern/Learning';
import HRAssignedTasks from './components/Pages/HR/Intern/AssignedTasks';
import HRBasics from './components/Pages/HR/Intern/Basics';
import HRTimeLog from './components/Pages/HR/Intern/TimeLog';
import HRFeedback from './components/Pages/HR/Intern/Feedback';
import HRProgress from './components/Pages/HR/Intern/Progress';

// IoT Department Pages - Manager  
import IoTTeamManagement from './components/Pages/IoT/Manager/TeamManagement';
import IoTDevices from './components/Pages/IoT/Manager/Devices';
import IoTProjects from './components/Pages/IoT/Manager/Projects';
import IoTSensorData from './components/Pages/IoT/Manager/SensorData';
import IoTMonitoring from './components/Pages/IoT/Manager/Monitoring';
import IoTMaintenance from './components/Pages/IoT/Manager/Maintenance';
import IoTAnalytics from './components/Pages/IoT/Manager/Analytics';

// IoT Department Pages - Employee
import IoTTasks from './components/Pages/IoT/Employee/Tasks';
import IoTTesting from './components/Pages/IoT/Employee/Testing';
import IoTDataAnalysis from './components/Pages/IoT/Employee/DataAnalysis';
import IoTLogs from './components/Pages/IoT/Employee/Logs';
import IoTTimeTracking from './components/Pages/IoT/Employee/TimeTracking';
import IoTUpdates from './components/Pages/IoT/Employee/Updates';

// IoT Department Pages - Intern
import IoTLearning from './components/Pages/IoT/Intern/Learning';
import IoTAssignedTasks from './components/Pages/IoT/Intern/AssignedTasks';
import IoTDeviceBasics from './components/Pages/IoT/Intern/DeviceBasics';
import IoTSensorTraining from './components/Pages/IoT/Intern/SensorTraining';
import IoTTimeLog from './components/Pages/IoT/Intern/TimeLog';
import IoTFeedback from './components/Pages/IoT/Intern/Feedback';

// Software Department Pages - Manager
import SoftwareTeamManagement from './components/Pages/Software/Manager/TeamManagement';
import SoftwareProjects from './components/Pages/Software/Manager/Projects';
import SoftwareCodeReviews from './components/Pages/Software/Manager/CodeReviews';
import SoftwareSprints from './components/Pages/Software/Manager/Sprints';
import SoftwareBugs from './components/Pages/Software/Manager/Bugs';
import SoftwareDeployments from './components/Pages/Software/Manager/Deployments';
import SoftwarePerformance from './components/Pages/Software/Manager/Performance';

// Software Department Pages - Employee
import SoftwareTasks from './components/Pages/Software/Employee/Tasks';
import SoftwareRepository from './components/Pages/Software/Employee/Repository';
import SoftwareBugReports from './components/Pages/Software/Employee/BugReports';
import SoftwareTimeTracking from './components/Pages/Software/Employee/TimeTracking';
import SoftwareDocs from './components/Pages/Software/Employee/Docs';
import SoftwareTesting from './components/Pages/Software/Employee/Testing';

// Software Department Pages - Intern
import SoftwareLearning from './components/Pages/Software/Intern/Learning';
import SoftwareAssignedTasks from './components/Pages/Software/Intern/AssignedTasks';
import SoftwareReviewTraining from './components/Pages/Software/Intern/ReviewTraining';
import SoftwareTools from './components/Pages/Software/Intern/Tools';
import SoftwareTimeLog from './components/Pages/Software/Intern/TimeLog';
import SoftwareFeedback from './components/Pages/Software/Intern/Feedback';

// Financial Department Pages - Manager
import FinancialTeamManagement from './components/Pages/Financial/Manager/TeamManagement';
import FinancialBudgets from './components/Pages/Financial/Manager/Budgets';
import FinancialExpenses from './components/Pages/Financial/Manager/Expenses';
import FinancialAnalysis from './components/Pages/Financial/Manager/Analysis';
import FinancialAudit from './components/Pages/Financial/Manager/Audit';
import FinancialPayroll from './components/Pages/Financial/Manager/Payroll';
import FinancialReports from './components/Pages/Financial/Manager/Reports';

// Financial Department Pages - Employee
import FinancialTasks from './components/Pages/Financial/Employee/Tasks';
import FinancialExpenseTracking from './components/Pages/Financial/Employee/ExpenseTracking';
import FinancialBudgetAnalysis from './components/Pages/Financial/Employee/BudgetAnalysis';
import FinancialInvoices from './components/Pages/Financial/Employee/Invoices';
import FinancialData from './components/Pages/Financial/Employee/Data';
import FinancialAuditSupport from './components/Pages/Financial/Employee/AuditSupport';

// Financial Department Pages - Intern
import FinancialLearning from './components/Pages/Financial/Intern/Learning';
import FinancialAssignedTasks from './components/Pages/Financial/Intern/AssignedTasks';
import FinancialAccountingBasics from './components/Pages/Financial/Intern/AccountingBasics';
import FinancialExcelTraining from './components/Pages/Financial/Intern/ExcelTraining';
import FinancialTimeLog from './components/Pages/Financial/Intern/TimeLog';
import FinancialFeedback from './components/Pages/Financial/Intern/Feedback';

// Business Department Pages - Manager
import BusinessTeamManagement from './components/Pages/Business/Manager/TeamManagement';
import BusinessClients from './components/Pages/Business/Manager/Clients';
import BusinessSales from './components/Pages/Business/Manager/Sales';
import BusinessMarketAnalysis from './components/Pages/Business/Manager/MarketAnalysis';
import BusinessStrategy from './components/Pages/Business/Manager/Strategy';
import BusinessPartnerships from './components/Pages/Business/Manager/Partnerships';
import BusinessReports from './components/Pages/Business/Manager/Reports';

// Business Department Pages - Employee
import BusinessTasks from './components/Pages/Business/Employee/Tasks';
import BusinessClientComm from './components/Pages/Business/Employee/ClientComm';
import BusinessSalesSupport from './components/Pages/Business/Employee/SalesSupport';
import BusinessMarketResearch from './components/Pages/Business/Employee/MarketResearch';
import BusinessProposals from './components/Pages/Business/Employee/Proposals';
import BusinessLeads from './components/Pages/Business/Employee/Leads';

// Business Department Pages - Intern
import BusinessLearning from './components/Pages/Business/Intern/Learning';
import BusinessAssignedTasks from './components/Pages/Business/Intern/AssignedTasks';
import BusinessMarketTraining from './components/Pages/Business/Intern/MarketTraining';
import BusinessClientBasics from './components/Pages/Business/Intern/ClientBasics';
import BusinessTimeLog from './components/Pages/Business/Intern/TimeLog';
import BusinessFeedback from './components/Pages/Business/Intern/Feedback';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <FourSquare color="#acadac" size="medium" text="Loading..." textColor="#e76d6d" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Publiclayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="service" element={<ServicePage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="careers" element={<CareersPage />} />
        </Route>
        <Route path="/applications/:applicationId/confirm-hiring/:token" element={<ConfirmHiring />} />


        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <Login />
        } />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes with Layout */}
        <Route path="/app" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* Default redirect to dashboard for authenticated users */}
          <Route index element={<Navigate to="/app/dashboard" replace />} />

          {/* Common Routes - All authenticated users */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* SuperAdmin Routes */}
          <Route path="users" element={
            <ProtectedRoute requiredRole="superadmin">
              <AllUsers />
            </ProtectedRoute>
          } />
          <Route path="system-settings" element={
            <ProtectedRoute requiredRole="superadmin">
              <SystemSettings />
            </ProtectedRoute>
          } />
          <Route path="analytics" element={
            <ProtectedRoute requiredRole="superadmin">
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="audit-logs" element={
            <ProtectedRoute requiredRole="superadmin">
              <AuditLogs />
            </ProtectedRoute>
          } />
          <Route path="backup" element={
            <ProtectedRoute requiredRole="superadmin">
              <BackupRestore />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="user-management" element={
            <ProtectedRoute requiredRole="admin">
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="department-reports" element={
            <ProtectedRoute requiredRole="admin">
              <DepartmentReports />
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute requiredRole="admin">
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="employee-records" element={
            <ProtectedRoute requiredRole="admin">
              <EmployeeRecords />
            </ProtectedRoute>
          } />
          <Route path="permissions" element={
            <ProtectedRoute requiredRole="admin">
              <Permissions />
            </ProtectedRoute>
          } />

          {/* CEO Routes */}
          <Route path="company-overview" element={
            <ProtectedRoute requiredRole="ceo">
              <CompanyOverview />
            </ProtectedRoute>
          } />
          <Route path="financial-reports" element={
            <ProtectedRoute requiredRole="ceo">
              <CeoFinancialReports />
            </ProtectedRoute>
          } />
          <Route path="strategic-planning" element={
            <ProtectedRoute requiredRole="ceo">
              <StrategicPlanning />
            </ProtectedRoute>
          } />
          <Route path="board-reports" element={
            <ProtectedRoute requiredRole="ceo">
              <BoardReports />
            </ProtectedRoute>
          } />
          <Route path="executive-settings" element={
            <ProtectedRoute requiredRole="ceo">
              <ExecutiveSettings />
            </ProtectedRoute>
          } />

          {/* HR Department Routes */}
          {/* HR Manager Routes */}
          <Route path="hr/team-management" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="hr">
              <HRTeamManagement />
            </ProtectedRoute>
          } />
          <Route path="hr/recruitment" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="hr">
              <HRRecruitment />
            </ProtectedRoute>
          } />
          <Route path="hr/employee-relations" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="hr">
              <HREmployeeRelations />
            </ProtectedRoute>
          } />
          <Route path="hr/policies" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="hr">
              <HRPolicies />
            </ProtectedRoute>
          } />
          <Route path="hr/jobs" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="hr">
              <HRJobs />
            </ProtectedRoute>
          } />
          <Route path="hr/application" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="hr">
              <Application />
            </ProtectedRoute>
          } />
          <Route path="hr/training" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="hr">
              <HRTraining />
            </ProtectedRoute>
          } />
          <Route path="hr/performance" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="hr">
              <HRPerformance />
            </ProtectedRoute>
          } />
          <Route path="hr/reports" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="hr">
              <HRReports />
            </ProtectedRoute>
          } />

          {/* HR Employee Routes */}
          <Route path="hr/tasks" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="hr">
              <HRTasks />
            </ProtectedRoute>
          } />
          <Route path="hr/employee-database" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="hr">
              <HREmployeeDatabase />
            </ProtectedRoute>
          } />
          <Route path="hr/recruitment-support" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="hr">
              <HRRecruitmentSupport />
            </ProtectedRoute>
          } />
          <Route path="hr/training-records" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="hr">
              <HRTrainingRecords />
            </ProtectedRoute>
          } />
          <Route path="hr/leave-management" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="hr">
              <HRLeaveManagement />
            </ProtectedRoute>
          } />
          <Route path="hr/hr-analytics" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="hr">
              <HRAnalytics />
            </ProtectedRoute>
          } />

          {/* HR Intern Routes */}
          <Route path="hr/learning" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="hr">
              <HRLearning />
            </ProtectedRoute>
          } />
          <Route path="hr/assigned-tasks" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="hr">
              <HRAssignedTasks />
            </ProtectedRoute>
          } />
          <Route path="hr/basics" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="hr">
              <HRBasics />
            </ProtectedRoute>
          } />
          <Route path="hr/time-log" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="hr">
              <HRTimeLog />
            </ProtectedRoute>
          } />
          <Route path="hr/feedback" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="hr">
              <HRFeedback />
            </ProtectedRoute>
          } />
          <Route path="hr/progress" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="hr">
              <HRProgress />
            </ProtectedRoute>
          } />

          {/* IoT Department Routes */}
          {/* IoT Manager Routes */}
          <Route path="iot/team-management" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="iot">
              <IoTTeamManagement />
            </ProtectedRoute>
          } />
          <Route path="iot/devices" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="iot">
              <IoTDevices />
            </ProtectedRoute>
          } />
          <Route path="iot/projects" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="iot">
              <IoTProjects />
            </ProtectedRoute>
          } />
          <Route path="iot/sensor-data" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="iot">
              <IoTSensorData />
            </ProtectedRoute>
          } />
          <Route path="iot/monitoring" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="iot">
              <IoTMonitoring />
            </ProtectedRoute>
          } />
          <Route path="iot/maintenance" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="iot">
              <IoTMaintenance />
            </ProtectedRoute>
          } />
          <Route path="iot/analytics" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="iot">
              <IoTAnalytics />
            </ProtectedRoute>
          } />

          {/* IoT Employee Routes */}
          <Route path="iot/tasks" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="iot">
              <IoTTasks />
            </ProtectedRoute>
          } />
          <Route path="iot/testing" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="iot">
              <IoTTesting />
            </ProtectedRoute>
          } />
          <Route path="iot/data-analysis" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="iot">
              <IoTDataAnalysis />
            </ProtectedRoute>
          } />
          <Route path="iot/logs" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="iot">
              <IoTLogs />
            </ProtectedRoute>
          } />
          <Route path="iot/time-tracking" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="iot">
              <IoTTimeTracking />
            </ProtectedRoute>
          } />
          <Route path="iot/updates" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="iot">
              <IoTUpdates />
            </ProtectedRoute>
          } />

          {/* IoT Intern Routes */}
          <Route path="iot/learning" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="iot">
              <IoTLearning />
            </ProtectedRoute>
          } />
          <Route path="iot/assigned-tasks" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="iot">
              <IoTAssignedTasks />
            </ProtectedRoute>
          } />
          <Route path="iot/device-basics" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="iot">
              <IoTDeviceBasics />
            </ProtectedRoute>
          } />
          <Route path="iot/sensor-training" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="iot">
              <IoTSensorTraining />
            </ProtectedRoute>
          } />
          <Route path="iot/time-log" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="iot">
              <IoTTimeLog />
            </ProtectedRoute>
          } />
          <Route path="iot/feedback" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="iot">
              <IoTFeedback />
            </ProtectedRoute>
          } />

          {/* Software Department Routes */}
          {/* Software Manager Routes */}
          <Route path="software/team-management" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="software">
              <SoftwareTeamManagement />
            </ProtectedRoute>
          } />
          <Route path="software/projects" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="software">
              <SoftwareProjects />
            </ProtectedRoute>
          } />
          <Route path="software/code-reviews" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="software">
              <SoftwareCodeReviews />
            </ProtectedRoute>
          } />
          <Route path="software/sprints" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="software">
              <SoftwareSprints />
            </ProtectedRoute>
          } />
          <Route path="software/bugs" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="software">
              <SoftwareBugs />
            </ProtectedRoute>
          } />
          <Route path="software/deployments" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="software">
              <SoftwareDeployments />
            </ProtectedRoute>
          } />
          <Route path="software/performance" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="software">
              <SoftwarePerformance />
            </ProtectedRoute>
          } />

          {/* Software Employee Routes */}
          <Route path="software/tasks" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="software">
              <SoftwareTasks />
            </ProtectedRoute>
          } />
          <Route path="software/repository" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="software">
              <SoftwareRepository />
            </ProtectedRoute>
          } />
          <Route path="software/bug-reports" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="software">
              <SoftwareBugReports />
            </ProtectedRoute>
          } />
          <Route path="software/time-tracking" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="software">
              <SoftwareTimeTracking />
            </ProtectedRoute>
          } />
          <Route path="software/docs" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="software">
              <SoftwareDocs />
            </ProtectedRoute>
          } />
          <Route path="software/testing" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="software">
              <SoftwareTesting />
            </ProtectedRoute>
          } />

          {/* Software Intern Routes */}
          <Route path="software/learning" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="software">
              <SoftwareLearning />
            </ProtectedRoute>
          } />
          <Route path="software/assigned-tasks" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="software">
              <SoftwareAssignedTasks />
            </ProtectedRoute>
          } />
          <Route path="software/review-training" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="software">
              <SoftwareReviewTraining />
            </ProtectedRoute>
          } />
          <Route path="software/tools" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="software">
              <SoftwareTools />
            </ProtectedRoute>
          } />
          <Route path="software/time-log" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="software">
              <SoftwareTimeLog />
            </ProtectedRoute>
          } />
          <Route path="software/feedback" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="software">
              <SoftwareFeedback />
            </ProtectedRoute>
          } />

          {/* Financial Department Routes */}
          {/* Financial Manager Routes */}
          <Route path="financial/team-management" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="financial">
              <FinancialTeamManagement />
            </ProtectedRoute>
          } />
          <Route path="financial/budgets" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="financial">
              <FinancialBudgets />
            </ProtectedRoute>
          } />
          <Route path="financial/expenses" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="financial">
              <FinancialExpenses />
            </ProtectedRoute>
          } />
          <Route path="financial/analysis" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="financial">
              <FinancialAnalysis />
            </ProtectedRoute>
          } />
          <Route path="financial/audit" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="financial">
              <FinancialAudit />
            </ProtectedRoute>
          } />
          <Route path="financial/payroll" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="financial">
              <FinancialPayroll />
            </ProtectedRoute>
          } />
          <Route path="financial/reports" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="financial">
              <FinancialReports />
            </ProtectedRoute>
          } />

          {/* Financial Employee Routes */}
          <Route path="financial/tasks" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="financial">
              <FinancialTasks />
            </ProtectedRoute>
          } />
          <Route path="financial/expense-tracking" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="financial">
              <FinancialExpenseTracking />
            </ProtectedRoute>
          } />
          <Route path="financial/budget-analysis" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="financial">
              <FinancialBudgetAnalysis />
            </ProtectedRoute>
          } />
          <Route path="financial/invoices" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="financial">
              <FinancialInvoices />
            </ProtectedRoute>
          } />
          <Route path="financial/data" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="financial">
              <FinancialData />
            </ProtectedRoute>
          } />
          <Route path="financial/audit-support" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="financial">
              <FinancialAuditSupport />
            </ProtectedRoute>
          } />

          {/* Financial Intern Routes */}
          <Route path="financial/learning" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="financial">
              <FinancialLearning />
            </ProtectedRoute>
          } />
          <Route path="financial/assigned-tasks" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="financial">
              <FinancialAssignedTasks />
            </ProtectedRoute>
          } />
          <Route path="financial/accounting-basics" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="financial">
              <FinancialAccountingBasics />
            </ProtectedRoute>
          } />
          <Route path="financial/excel-training" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="financial">
              <FinancialExcelTraining />
            </ProtectedRoute>
          } />
          <Route path="financial/time-log" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="financial">
              <FinancialTimeLog />
            </ProtectedRoute>
          } />
          <Route path="financial/feedback" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="financial">
              <FinancialFeedback />
            </ProtectedRoute>
          } />

          {/* Business Department Routes */}
          {/* Business Manager Routes */}
          <Route path="business/team-management" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="business">
              <BusinessTeamManagement />
            </ProtectedRoute>
          } />
          <Route path="business/clients" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="business">
              <BusinessClients />
            </ProtectedRoute>
          } />
          <Route path="business/sales" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="business">
              <BusinessSales />
            </ProtectedRoute>
          } />
          <Route path="business/market-analysis" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="business">
              <BusinessMarketAnalysis />
            </ProtectedRoute>
          } />
          <Route path="business/strategy" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="business">
              <BusinessStrategy />
            </ProtectedRoute>
          } />
          <Route path="business/partnerships" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="business">
              <BusinessPartnerships />
            </ProtectedRoute>
          } />
          <Route path="business/reports" element={
            <ProtectedRoute requiredRole="manager" requiredDepartment="business">
              <BusinessReports />
            </ProtectedRoute>
          } />

          {/* Business Employee Routes */}
          <Route path="business/tasks" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="business">
              <BusinessTasks />
            </ProtectedRoute>
          } />
          <Route path="business/client-comm" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="business">
              <BusinessClientComm />
            </ProtectedRoute>
          } />
          <Route path="business/sales-support" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="business">
              <BusinessSalesSupport />
            </ProtectedRoute>
          } />
          <Route path="business/market-research" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="business">
              <BusinessMarketResearch />
            </ProtectedRoute>
          } />
          <Route path="business/proposals" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="business">
              <BusinessProposals />
            </ProtectedRoute>
          } />
          <Route path="business/leads" element={
            <ProtectedRoute requiredRole="employee" requiredDepartment="business">
              <BusinessLeads />
            </ProtectedRoute>
          } />

          {/* Business Intern Routes */}
          <Route path="business/learning" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="business">
              <BusinessLearning />
            </ProtectedRoute>
          } />
          <Route path="business/assigned-tasks" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="business">
              <BusinessAssignedTasks />
            </ProtectedRoute>
          } />
          <Route path="business/market-training" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="business">
              <BusinessMarketTraining />
            </ProtectedRoute>
          } />
          <Route path="business/client-basics" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="business">
              <BusinessClientBasics />
            </ProtectedRoute>
          } />
          <Route path="business/time-log" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="business">
              <BusinessTimeLog />
            </ProtectedRoute>
          } />
          <Route path="business/feedback" element={
            <ProtectedRoute requiredRole="intern" requiredDepartment="business">
              <BusinessFeedback />
            </ProtectedRoute>
          } />
        </Route>

        {/* Fallback for undefined routes */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/app/dashboard" : "/login"} replace />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName={() =>
          "relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-white dark:bg-gray-800 shadow-lg"
        }
        bodyClassName={() => "text-sm font-white block p-3"}
      />
    </>
  );
}

export default App;