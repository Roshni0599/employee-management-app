const express = require('express');
const router = express.Router();

// in memory employee data
let employee = [
    {id:1,name:"sangeetha",dept:"accounts",age:20,salary:20000},
    {id:2,name:"monisha",dept:"sales",age:23,salary:25000},
    {id:3,name:"Roshni",dept:"sales",age:20,salary:19000}
];

// Read
router.get('/',(req,res) => {
    res.json(employee);
});

// update
router.put('/:id',(req,res)=> {
    const id = parseInt(req.params.id);
    const {name,dept,age,salary} = req.body;
     
    employee = employee.map(employee =>
        employee.id === id? { ...employee,name,dept,age,salary}: employee
    );

    res.json({
        message:"updated successfully",
        employee
    })
})

// update multiple
router.put('/', (req, res) => {
    const updates = req.body; // Expecting an array of objects with {id, name, dept, age, salary}
    let updatedCount = 0;

    employee = employee.map(emp => {
        const match = updates.find(u => u.id === emp.id);
        if (match) {
            updatedCount++;
            return { ...emp, ...match }; // merge fields from update
        }
        return emp;
    });

    if (updatedCount === 0) {
        return res.status(404).json({ message: "No matching employees found" });
    }

    res.json({
        message: `Updated ${updatedCount} employee(s) successfully`,
        employees: employee
    });
});


  // Create (single or multiple employees)
router.post('/', (req, res) => {
    const newEntries = Array.isArray(req.body) ? req.body : [req.body]; 

    // Generate IDs automatically
    const startId = employee.length > 0 ? Math.max(...employee.map(emp => emp.id)) + 1 : 1;

    const createdEmployees = newEntries.map((emp, index) => ({
        id: startId + index,
        ...emp
    }));

    employee = [...employee, ...createdEmployees];

    res.status(201).json({
        message: `Added ${createdEmployees.length} employee(s) successfully`,
        employees: employee
    });
});

// Delete single employee 
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = employee.length;

  employee = employee.filter(emp => emp.id !== id);

  if (employee.length === initialLength) {
    return res.status(404).json({ message: "Employee not found" });
  }

  res.json({
    message: `Employee with id ${id} deleted successfully`,
    employees: employee
  });
});

// Delete multiple employees 
router.delete('/', (req, res) => {
  const ids = Array.isArray(req.body) ? req.body : [req.body];
  const initialLength = employee.length;

  employee = employee.filter(emp => !ids.includes(emp.id));

  const deletedCount = initialLength - employee.length;

  if (deletedCount === 0) {
    return res.status(404).json({ message: "No matching employees found to delete" });
  }

  res.json({
    message: `Deleted ${deletedCount} employee(s) successfully`,
    employees: employee
  });
});





// export router (important)
module.exports = router;
