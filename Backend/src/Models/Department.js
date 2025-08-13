// models/Department.js
const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['hr', 'iot', 'software', 'financial', 'business'],
        required: true,
        unique: true
    },
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: String,
    budget: {
        allocated: { type: Number, default: 0 },
        spent: { type: Number, default: 0 }
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    objectives: [String],
    kpis: [{
        name: String,
        target: Number,
        current: Number,
        unit: String
    }]
}, { timestamps: true });

export default mongoose.model('Department', departmentSchema);