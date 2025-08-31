export function checkRoleAndDepartment(allowedRoles = [], allowedDepartments = []) {
    // Roles that don't require department check
    const skipDepartmentFor = ["superadmin", "admin", "ceo"];

    return (req, res, next) => {
        const userRole = req.user?.role?.toLowerCase();
        const userDepartment = req.user?.department;

        if (!userRole || !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
            return res.status(403).json({ message: "Access denied: Role not allowed" });
        }

        // Skip department check if role is in skipDepartmentFor
        if (!skipDepartmentFor.includes(userRole)) {
            if (!userDepartment || !allowedDepartments.map(d => d.toLowerCase()).includes(userDepartment.toLowerCase())) {
                return res.status(403).json({ message: "Access denied: Department not allowed" });
            }
        }

    next();
    };
}


