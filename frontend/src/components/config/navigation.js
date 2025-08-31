import { 
  Home, Users, Settings, BarChart3, FileText, Calendar,
  Shield, DollarSign, Package, UserCheck, Clock, Award,
  Cpu, Code, TrendingUp, Briefcase, UserPlus, Database,
  Monitor, Wrench, Calculator, PieChart, Target, Building ,ShieldCheck ,Mails, NotebookPen,
} from 'lucide-react';

export const navigationConfig = {
  superadmin: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'All Users', path: '/app/users', icon: Users },
    { name: 'Analytics', path: '/app/analytics', icon: BarChart3 },
    { name: 'Email', path: '/app/mail', icon: Mails },
    { name: 'System Settings', path: '/app/system-settings', icon: Settings },
    { name: 'Audit Logs', path: '/app/audit-logs', icon: FileText },
    { name: 'Backup & Restore', path: '/app/backup', icon: Shield }
  ],
  admin: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'User Management', path: '/app/user-management', icon: Users },
    { name: 'Department Reports', path: '/app/department-reports', icon: BarChart3 },
    { name: 'Settings', path: '/app/settings', icon: Settings },
    { name: 'Employee Records', path: '/app/employee-records', icon: FileText },
    { name: 'Permissions', path: '/app/permissions', icon: Shield }
  ],
  ceo: [
    { name: 'Executive Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'Company Overview', path: '/app/company-overview', icon: BarChart3 },
    { name: 'Financial Reports', path: '/app/financial-reports', icon: DollarSign },
    { name: 'Strategic Planning', path: '/app/strategic-planning', icon: Package },
    { name: 'Board Reports', path: '/app/board-reports', icon: FileText },
    { name: 'Executive Settings', path: '/app/executive-settings', icon: Settings }
  ]
};

// Department-specific navigation for managers
export const managerNavigationConfig = {
  hr: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'Job Management', path: '/app/hr/jobs', icon: FileText },
    { name: 'Application Management', path: '/app/hr/application', icon: UserPlus },
    { name: 'Payment Verification', path: '/app/hr/payment-verification', icon: ShieldCheck },
    { name: 'Assigned Tasks', path: '/app/hr/managertasks', icon: FileText },
    { name: 'HR Team', path: '/app/hr/team-management', icon: Users },
    { name: 'Recruitment', path: '/app/hr/recruitment', icon: UserPlus },
    { name: 'Employee Relations', path: '/app/hr/employee-relations', icon: UserCheck },
    { name: 'HR Policies', path: '/app/hr/policies', icon: FileText },
    { name: 'Training Programs', path: '/app/hr/training', icon: Award },
    { name: 'Performance Reviews', path: '/app/hr/performance', icon: BarChart3 },
    { name: 'HR Reports', path: '/app/hr/reports', icon: PieChart }
  ],
  iot: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'Assigned Tasks', path: '/app/iot/managertasks', icon: FileText },
    { name: 'IoT Team', path: '/app/iot/team-management', icon: Users },
    { name: 'Device Management', path: '/app/iot/devices', icon: Cpu },
    { name: 'IoT Projects', path: '/app/iot/projects', icon: Package },
    { name: 'Sensor Data', path: '/app/iot/sensor-data', icon: Database },
    { name: 'System Monitoring', path: '/app/iot/monitoring', icon: Monitor },
    { name: 'Maintenance', path: '/app/iot/maintenance', icon: Wrench },
    { name: 'IoT Analytics', path: '/app/iot/analytics', icon: BarChart3 }
  ],
  software: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'Assigned Tasks', path: '/app/software/managertasks', icon: FileText },
    { name: 'Dev Team', path: '/app/software/team-management', icon: Users },
    { name: 'Projects', path: '/app/software/projects', icon: Code },
    { name: 'Code Reviews', path: '/app/software/code-reviews', icon: FileText },
    { name: 'Sprint Planning', path: '/app/software/sprints', icon: Calendar },
    { name: 'Bug Tracking', path: '/app/software/bugs', icon: Shield },
    { name: 'Deployments', path: '/app/software/deployments', icon: Package },
    { name: 'Performance', path: '/app/software/performance', icon: BarChart3 }
  ],
  financial: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'Assigned Tasks', path: '/app/financial/managertasks', icon: FileText },
    { name: 'Finance Team', path: '/app/financial/team-management', icon: Users },
    { name: 'Budget Planning', path: '/app/financial/budgets', icon: Calculator },
    { name: 'Expense Reports', path: '/app/financial/expenses', icon: DollarSign },
    { name: 'Financial Analysis', path: '/app/financial/analysis', icon: TrendingUp },
    { name: 'Auditing', path: '/app/financial/audit', icon: Shield },
    { name: 'Payroll Management', path: '/app/financial/payroll', icon: FileText },
    { name: 'Financial Reports', path: '/app/financial/reports', icon: PieChart }
  ],
  business: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'Assigned Tasks', path: '/app/business/managertasks', icon: FileText },
    { name: 'Business Team', path: '/app/business/team-management', icon: Users },
    { name: 'Client Relations', path: '/app/business/clients', icon: Briefcase },
    { name: 'Sales Pipeline', path: '/app/business/sales', icon: TrendingUp },
    { name: 'Market Analysis', path: '/app/business/market-analysis', icon: BarChart3 },
    { name: 'Business Strategy', path: '/app/business/strategy', icon: Target },
    { name: 'Partnerships', path: '/app/business/partnerships', icon: Building },
    { name: 'Business Reports', path: '/app/business/reports', icon: PieChart }
  ]
};

// Department-specific navigation for employees
export const employeeNavigationConfig = {
  hr: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'My Profile', path: '/app/profile', icon: Users },
    { name: 'Assigned Tasks', path: '/app/hr/employeetasks', icon: FileText },
    { name: 'Employee Database', path: '/app/hr/employee-database', icon: Database },
    { name: 'Recruitment Support', path: '/app/hr/recruitment-support', icon: UserPlus },
    { name: 'Training Records', path: '/app/hr/training-records', icon: Award },
    { name: 'Leave Management', path: '/app/hr/leave-management', icon: Calendar },
    { name: 'HR Analytics', path: '/app/hr/hr-analytics', icon: BarChart3 }
  ],
  iot: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'My Profile', path: '/app/profile', icon: Users },
    { name: 'Assigned Tasks', path: '/app/iot/employeetasks', icon: FileText },
    { name: 'Device Testing', path: '/app/iot/testing', icon: Cpu },
    { name: 'Data Analysis', path: '/app/iot/data-analysis', icon: Database },
    { name: 'System Logs', path: '/app/iot/logs', icon: Monitor },
    { name: 'Time Tracking', path: '/app/iot/time-tracking', icon: Clock },
    { name: 'Project Updates', path: '/app/iot/updates', icon: Package }
  ],
  software: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'My Profile', path: '/app/profile', icon: Users },
    { name: 'Assigned Tasks', path: '/app/software/employeetasks', icon: FileText },
    { name: 'Development Tasks', path: '/app/software/tasks', icon: Code },
    { name: 'Code Repository', path: '/app/software/repository', icon: Database },
    { name: 'Bug Reports', path: '/app/software/bug-reports', icon: Shield },
    { name: 'Time Tracking', path: '/app/software/time-tracking', icon: Clock },
    { name: 'Documentation', path: '/app/software/docs', icon: FileText },
    { name: 'Testing', path: '/app/software/testing', icon: UserCheck }
  ],
  financial: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'My Profile', path: '/app/profile', icon: Users },
     { name: 'Assigned Tasks', path: '/app/financial/employeetasks', icon: FileText },
    { name: 'Financial Tasks', path: '/app/financial/tasks', icon: Calculator },
    { name: 'Expense Tracking', path: '/app/financial/expense-tracking', icon: DollarSign },
    { name: 'Budget Analysis', path: '/app/financial/budget-analysis', icon: PieChart },
    { name: 'Invoice Management', path: '/app/financial/invoices', icon: FileText },
    { name: 'Financial Data', path: '/app/financial/data', icon: Database },
    { name: 'Audit Support', path: '/app/financial/audit-support', icon: Shield }
  ],
  business: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'My Profile', path: '/app/profile', icon: Users },
     { name: 'Assigned Tasks', path: '/app/business/employeetasks', icon: FileText },
    { name: 'Business Tasks', path: '/app/business/tasks', icon: Briefcase },
    { name: 'Client Communication', path: '/app/business/client-comm', icon: Users },
    { name: 'Sales Support', path: '/app/business/sales-support', icon: TrendingUp },
    { name: 'Market Research', path: '/app/business/market-research', icon: BarChart3 },
    { name: 'Proposals', path: '/app/business/proposals', icon: FileText },
    { name: 'Lead Management', path: '/app/business/leads', icon: Target }
  ]
};

// Department-specific navigation for interns
export const internNavigationConfig = {
  hr: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'My Profile', path: '/app/profile', icon: Users },
    { name: 'Assigned Tasks', path: '/app/hr/interntasks', icon: FileText },
    { name: 'HR Learning', path: '/app/hr/learning', icon: Award },
    { name: 'HR Basics', path: '/app/hr/basics', icon: UserCheck },
    { name: 'Time Log', path: '/app/hr/time-log', icon: Clock },
    { name: 'Mentor Feedback', path: '/app/hr/feedback', icon: Users },
    { name: 'Training Progress', path: '/app/hr/progress', icon: BarChart3 }
  ],
  iot: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'My Profile', path: '/app/profile', icon: Users },
    { name: 'Assigned Tasks', path: '/app/iot/interntasks', icon: FileText },
    { name: 'IoT Learning', path: '/app/iot/learning', icon: Award },
    { name: 'Device Basics', path: '/app/iot/device-basics', icon: Cpu },
    { name: 'Sensor Training', path: '/app/iot/sensor-training', icon: Database },
    { name: 'Time Log', path: '/app/iot/time-log', icon: Clock },
    { name: 'Technical Feedback', path: '/app/iot/feedback', icon: Users }
  ],
  software: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'My Profile', path: '/app/profile', icon: Users },
    { name: 'Assigned Tasks', path: '/app/software/interntasks', icon: FileText },
    { name: 'Coding Tasks', path: '/app/software/assigned-tasks', icon: Code },
    { name: 'Coding Learning', path: '/app/software/learning', icon: Award },
    { name: 'Code Review Training', path: '/app/software/review-training', icon: FileText },
    { name: 'Development Tools', path: '/app/software/tools', icon: Wrench },
    { name: 'Time Log', path: '/app/software/time-log', icon: Clock },
    { name: 'Mentor Feedback', path: '/app/software/feedback', icon: Users }
  ],
  financial: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'My Profile', path: '/app/profile', icon: Users },
     { name: 'Assigned Tasks', path: '/app/financial/interntasks', icon: FileText },
    { name: 'Finance Learning', path: '/app/financial/learning', icon: Award },
    { name: 'Finance Tasks', path: '/app/financial/assigned-tasks', icon: Calculator },
    { name: 'Accounting Basics', path: '/app/financial/accounting-basics', icon: FileText },
    { name: 'Excel Training', path: '/app/financial/excel-training', icon: Database },
    { name: 'Time Log', path: '/app/financial/time-log', icon: Clock },
    { name: 'Finance Feedback', path: '/app/financial/feedback', icon: Users }
  ],
  business: [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'My Profile', path: '/app/profile', icon: Users },
    { name: 'Assigned Tasks', path: '/app/business/interntasks', icon: FileText },
    { name: 'Business Learning', path: '/app/business/learning', icon: Award },
    { name: 'Business Tasks', path: '/app/business/assigned-tasks', icon: Briefcase },
    { name: 'Market Research Training', path: '/app/business/market-training', icon: BarChart3 },
    { name: 'Client Relations Basics', path: '/app/business/client-basics', icon: Users },
    { name: 'Time Log', path: '/app/business/time-log', icon: Clock },
    { name: 'Business Feedback', path: '/app/business/feedback', icon: TrendingUp }
  ]
};

// Helper function to get navigation based on user role and department
export const getNavigationConfig = (user) => {
  if (!user) return [];

  // For roles without departments
  if (['superadmin', 'admin', 'ceo'].includes(user.role)) {
    return navigationConfig[user.role] || [];
  }

  // For roles with departments
  if (user.role === 'manager') {
    return managerNavigationConfig[user.department] || [];
  }
  
  if (user.role === 'employee') {
    return employeeNavigationConfig[user.department] || [];
  }
  
  if (user.role === 'intern') {
    return internNavigationConfig[user.department] || [];
  }

  return [];
};