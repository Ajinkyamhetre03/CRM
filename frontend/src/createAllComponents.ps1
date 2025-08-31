# createAllComponents.ps1

# Base path
$basePath = "C:\Users\ajink\Downloads\tp\scamProject\fs3\frontend\src\components\Pages"

# List of all component paths
$files = @(
    # HR Manager
    "HR\Manager\TeamManagement.jsx",
    "HR\Manager\Recruitment.jsx",
    "HR\Manager\EmployeeRelations.jsx",
    "HR\Manager\Policies.jsx",
    "HR\Manager\Training.jsx",
    "HR\Manager\Performance.jsx",
    "HR\Manager\Reports.jsx",

    # HR Employee
    "HR\Employee\Tasks.jsx",
    "HR\Employee\EmployeeDatabase.jsx",
    "HR\Employee\RecruitmentSupport.jsx",
    "HR\Employee\TrainingRecords.jsx",
    "HR\Employee\LeaveManagement.jsx",
    "HR\Employee\Analytics.jsx",

    # HR Intern
    "HR\Intern\Learning.jsx",
    "HR\Intern\AssignedTasks.jsx",
    "HR\Intern\Basics.jsx",
    "HR\Intern\TimeLog.jsx",
    "HR\Intern\Feedback.jsx",
    "HR\Intern\Progress.jsx",

    # IoT Manager
    "IoT\Manager\TeamManagement.jsx",
    "IoT\Manager\Devices.jsx",
    "IoT\Manager\Projects.jsx",
    "IoT\Manager\SensorData.jsx",
    "IoT\Manager\Monitoring.jsx",
    "IoT\Manager\Maintenance.jsx",
    "IoT\Manager\Analytics.jsx",

    # IoT Employee
    "IoT\Employee\Tasks.jsx",
    "IoT\Employee\Testing.jsx",
    "IoT\Employee\DataAnalysis.jsx",
    "IoT\Employee\Logs.jsx",
    "IoT\Employee\TimeTracking.jsx",
    "IoT\Employee\Updates.jsx",

    # IoT Intern
    "IoT\Intern\Learning.jsx",
    "IoT\Intern\AssignedTasks.jsx",
    "IoT\Intern\DeviceBasics.jsx",
    "IoT\Intern\SensorTraining.jsx",
    "IoT\Intern\TimeLog.jsx",
    "IoT\Intern\Feedback.jsx",

    # Software Manager
    "Software\Manager\TeamManagement.jsx",
    "Software\Manager\Projects.jsx",
    "Software\Manager\CodeReviews.jsx",
    "Software\Manager\Sprints.jsx",
    "Software\Manager\Bugs.jsx",
    "Software\Manager\Deployments.jsx",
    "Software\Manager\Performance.jsx",

    # Software Employee
    "Software\Employee\Tasks.jsx",
    "Software\Employee\Repository.jsx",
    "Software\Employee\BugReports.jsx",
    "Software\Employee\TimeTracking.jsx",
    "Software\Employee\Docs.jsx",
    "Software\Employee\Testing.jsx",

    # Software Intern
    "Software\Intern\Learning.jsx",
    "Software\Intern\AssignedTasks.jsx",
    "Software\Intern\ReviewTraining.jsx",
    "Software\Intern\Tools.jsx",
    "Software\Intern\TimeLog.jsx",
    "Software\Intern\Feedback.jsx",

    # Financial Manager
    "Financial\Manager\TeamManagement.jsx",
    "Financial\Manager\Budgets.jsx",
    "Financial\Manager\Expenses.jsx",
    "Financial\Manager\Analysis.jsx",
    "Financial\Manager\Audit.jsx",
    "Financial\Manager\Payroll.jsx",
    "Financial\Manager\Reports.jsx",

    # Financial Employee
    "Financial\Employee\Tasks.jsx",
    "Financial\Employee\ExpenseTracking.jsx",
    "Financial\Employee\BudgetAnalysis.jsx",
    "Financial\Employee\Invoices.jsx",
    "Financial\Employee\Data.jsx",
    "Financial\Employee\AuditSupport.jsx",

    # Financial Intern
    "Financial\Intern\Learning.jsx",
    "Financial\Intern\AssignedTasks.jsx",
    "Financial\Intern\AccountingBasics.jsx",
    "Financial\Intern\ExcelTraining.jsx",
    "Financial\Intern\TimeLog.jsx",
    "Financial\Intern\Feedback.jsx",

    # Business Manager
    "Business\Manager\TeamManagement.jsx",
    "Business\Manager\Clients.jsx",
    "Business\Manager\Sales.jsx",
    "Business\Manager\MarketAnalysis.jsx",
    "Business\Manager\Strategy.jsx",
    "Business\Manager\Partnerships.jsx",
    "Business\Manager\Reports.jsx",

    # Business Employee
    "Business\Employee\Tasks.jsx",
    "Business\Employee\ClientComm.jsx",
    "Business\Employee\SalesSupport.jsx",
    "Business\Employee\MarketResearch.jsx",
    "Business\Employee\Proposals.jsx",
    "Business\Employee\Leads.jsx",

    # Business Intern
    "Business\Intern\Learning.jsx",
    "Business\Intern\AssignedTasks.jsx",
    "Business\Intern\MarketTraining.jsx",
    "Business\Intern\ClientBasics.jsx",
    "Business\Intern\TimeLog.jsx",
    "Business\Intern\Feedback.jsx"
)

# Loop to create folders/files with RFCE content
foreach ($file in $files) {
    $fullPath = Join-Path $basePath $file
    $dir = Split-Path $fullPath
    if (-not (Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory -Force
    }
    $componentName = [System.IO.Path]::GetFileNameWithoutExtension($fullPath)
    $content = @"
import React from "react";
import { Clock } from "lucide-react";

const $componentName = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-150px)] overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700 text-center">
        <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Page Coming Soon $componentName
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          We're working hard to bring you this feature. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default $componentName;
"@
    Set-Content -Path $fullPath -Value $content
    Write-Host "Created $fullPath"
}
