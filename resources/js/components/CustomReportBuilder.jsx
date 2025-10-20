import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Trash2, 
    Eye, 
    Save, 
    Download, 
    BarChart3, 
    PieChart, 
    TrendingUp,
    Calendar,
    Users,
    FileText,
    Settings,
    Filter,
    Search,
    ChevronDown,
    ChevronRight,
    GripVertical,
    X
} from 'lucide-react';

const CustomReportBuilder = ({ onSave, onPreview, onGenerate }) => {
    const [reportConfig, setReportConfig] = useState({
        name: '',
        description: '',
        category: 'overview',
        dateRange: {
            start: new Date().toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
        },
        fields: [],
        filters: [],
        visualizations: [],
        grouping: [],
        sorting: [],
        format: 'pdf'
    });

    const [availableFields, setAvailableFields] = useState({
        patients: [
            { id: 'firstname', name: 'First Name', type: 'text', category: 'basic' },
            { id: 'lastname', name: 'Last Name', type: 'text', category: 'basic' },
            { id: 'gender', name: 'Gender', type: 'select', category: 'basic' },
            { id: 'birth', name: 'Birth Date', type: 'date', category: 'basic' },
            { id: 'address', name: 'Address', type: 'text', category: 'contact' },
            { id: 'contactno', name: 'Contact Number', type: 'text', category: 'contact' },
            { id: 'email', name: 'Email', type: 'email', category: 'contact' },
            { id: 'registration_date', name: 'Registration Date', type: 'date', category: 'system' },
            { id: 'last_visit', name: 'Last Visit', type: 'date', category: 'system' },
            { id: 'total_appointments', name: 'Total Appointments', type: 'number', category: 'metrics' },
            { id: 'completed_appointments', name: 'Completed Appointments', type: 'number', category: 'metrics' }
        ],
        appointments: [
            { id: 'date', name: 'Date', type: 'date', category: 'basic' },
            { id: 'time', name: 'Time', type: 'time', category: 'basic' },
            { id: 'status', name: 'Status', type: 'select', category: 'basic' },
            { id: 'service_name', name: 'Service Name', type: 'text', category: 'service' },
            { id: 'patient_name', name: 'Patient Name', type: 'text', category: 'patient' },
            { id: 'staff_name', name: 'Staff Name', type: 'text', category: 'staff' },
            { id: 'notes', name: 'Notes', type: 'text', category: 'additional' },
            { id: 'duration', name: 'Duration (minutes)', type: 'number', category: 'metrics' },
            { id: 'wait_time', name: 'Wait Time (minutes)', type: 'number', category: 'metrics' }
        ],
        inventory: [
            { id: 'item_name', name: 'Item Name', type: 'text', category: 'basic' },
            { id: 'generic_name', name: 'Generic Name', type: 'text', category: 'basic' },
            { id: 'category', name: 'Category', type: 'select', category: 'basic' },
            { id: 'current_stock', name: 'Current Stock', type: 'number', category: 'inventory' },
            { id: 'minimum_stock', name: 'Minimum Stock', type: 'number', category: 'inventory' },
            { id: 'expiry_date', name: 'Expiry Date', type: 'date', category: 'inventory' },
            { id: 'days_until_expiry', name: 'Days Until Expiry', type: 'number', category: 'inventory' },
            { id: 'status', name: 'Status', type: 'select', category: 'status' },
            { id: 'priority', name: 'Priority', type: 'select', category: 'status' },
            { id: 'manufacturer', name: 'Manufacturer', type: 'text', category: 'details' },
            { id: 'batch_number', name: 'Batch Number', type: 'text', category: 'details' }
        ],
        staff: [
            { id: 'firstname', name: 'First Name', type: 'text', category: 'basic' },
            { id: 'lastname', name: 'Last Name', type: 'text', category: 'basic' },
            { id: 'role', name: 'Role', type: 'select', category: 'basic' },
            { id: 'status', name: 'Status', type: 'select', category: 'basic' },
            { id: 'email', name: 'Email', type: 'email', category: 'contact' },
            { id: 'contactno', name: 'Contact Number', type: 'text', category: 'contact' },
            { id: 'hire_date', name: 'Hire Date', type: 'date', category: 'employment' },
            { id: 'total_appointments', name: 'Total Appointments', type: 'number', category: 'metrics' },
            { id: 'completed_appointments', name: 'Completed Appointments', type: 'number', category: 'metrics' },
            { id: 'performance_score', name: 'Performance Score', type: 'number', category: 'metrics' }
        ]
    });

    const [dragOverField, setDragOverField] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        fields: true,
        filters: false,
        visualizations: false,
        grouping: false
    });

    const visualizationTypes = [
        { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
        { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Show proportions of a whole' },
        { id: 'line', name: 'Line Chart', icon: TrendingUp, description: 'Show trends over time' },
        { id: 'table', name: 'Data Table', icon: FileText, description: 'Display detailed data in table format' }
    ];

    const handleFieldDragStart = (e, field) => {
        e.dataTransfer.setData('application/json', JSON.stringify(field));
    };

    const handleFieldDrop = (e) => {
        e.preventDefault();
        const field = JSON.parse(e.dataTransfer.getData('application/json'));
        
        if (!reportConfig.fields.find(f => f.id === field.id)) {
            setReportConfig(prev => ({
                ...prev,
                fields: [...prev.fields, { ...field, order: prev.fields.length }]
            }));
        }
        setDragOverField(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOverField(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOverField(false);
    };

    const removeField = (fieldId) => {
        setReportConfig(prev => ({
            ...prev,
            fields: prev.fields.filter(f => f.id !== fieldId)
        }));
    };

    const addFilter = () => {
        setReportConfig(prev => ({
            ...prev,
            filters: [...prev.filters, {
                id: Date.now(),
                field: '',
                operator: 'equals',
                value: '',
                type: 'text'
            }]
        }));
    };

    const updateFilter = (filterId, updates) => {
        setReportConfig(prev => ({
            ...prev,
            filters: prev.filters.map(f => 
                f.id === filterId ? { ...f, ...updates } : f
            )
        }));
    };

    const removeFilter = (filterId) => {
        setReportConfig(prev => ({
            ...prev,
            filters: prev.filters.filter(f => f.id !== filterId)
        }));
    };

    const addVisualization = (type) => {
        setReportConfig(prev => ({
            ...prev,
            visualizations: [...prev.visualizations, {
                id: Date.now(),
                type: type,
                title: `${type.name} Visualization`,
                fields: [],
                config: {}
            }]
        }));
    };

    const updateVisualization = (vizId, updates) => {
        setReportConfig(prev => ({
            ...prev,
            visualizations: prev.visualizations.map(v => 
                v.id === vizId ? { ...v, ...updates } : v
            )
        }));
    };

    const removeVisualization = (vizId) => {
        setReportConfig(prev => ({
            ...prev,
            visualizations: prev.visualizations.filter(v => v.id !== vizId)
        }));
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getFieldOptions = () => {
        return availableFields[reportConfig.category] || [];
    };

    const getGroupedFields = () => {
        const fields = getFieldOptions();
        return fields.reduce((groups, field) => {
            if (!groups[field.category]) {
                groups[field.category] = [];
            }
            groups[field.category].push(field);
            return groups;
        }, {});
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Report Builder</h1>
                <p className="text-gray-600">Create powerful, customized reports with drag-and-drop simplicity</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Field Selection */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-4">
                        <h3 className="text-lg font-semibold mb-4">Available Fields</h3>
                        
                        {/* Category Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Data Category</label>
                            <select
                                value={reportConfig.category}
                                onChange={(e) => setReportConfig(prev => ({ ...prev, category: e.target.value, fields: [] }))}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="patients">Patients</option>
                                <option value="appointments">Appointments</option>
                                <option value="inventory">Inventory</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>

                        {/* Field Groups */}
                        <div className="space-y-2">
                            {Object.entries(getGroupedFields()).map(([category, fields]) => (
                                <div key={category}>
                                    <button
                                        onClick={() => toggleSection(category)}
                                        className="flex items-center justify-between w-full text-left p-2 hover:bg-gray-50 rounded"
                                    >
                                        <span className="font-medium capitalize">{category}</span>
                                        {expandedSections[category] ? 
                                            <ChevronDown className="h-4 w-4" /> : 
                                            <ChevronRight className="h-4 w-4" />
                                        }
                                    </button>
                                    
                                    <AnimatePresence>
                                        {expandedSections[category] && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-4 space-y-1">
                                                    {fields.map(field => (
                                                        <div
                                                            key={field.id}
                                                            draggable
                                                            onDragStart={(e) => handleFieldDragStart(e, field)}
                                                            className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-move hover:bg-gray-100"
                                                        >
                                                            <GripVertical className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm">{field.name}</span>
                                                            <span className="text-xs text-gray-500 bg-gray-200 px-1 rounded">
                                                                {field.type}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center Panel - Report Configuration */}
                <div className="lg:col-span-2">
                    <div className="space-y-6">
                        {/* Report Basic Info */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-semibold mb-4">Report Configuration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                                    <input
                                        type="text"
                                        value={reportConfig.name}
                                        onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="Enter report name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
                                    <select
                                        value={reportConfig.format}
                                        onChange={(e) => setReportConfig(prev => ({ ...prev, format: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        <option value="pdf">PDF</option>
                                        <option value="excel">Excel</option>
                                        <option value="csv">CSV</option>
                                        <option value="web">Web View</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={reportConfig.description}
                                    onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    rows={3}
                                    placeholder="Enter report description"
                                />
                            </div>
                        </div>

                        {/* Selected Fields */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Selected Fields</h3>
                                <span className="text-sm text-gray-500">{reportConfig.fields.length} fields</span>
                            </div>
                            
                            <div
                                onDrop={handleFieldDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={`min-h-[100px] border-2 border-dashed rounded-lg p-4 ${
                                    dragOverField ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                                }`}
                            >
                                {reportConfig.fields.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                        <p>Drag fields here to add them to your report</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {reportConfig.fields.map((field, index) => (
                                            <div
                                                key={field.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                                    <span className="font-medium">{field.name}</span>
                                                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                                        {field.type}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => removeField(field.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Filters</h3>
                                <button
                                    onClick={addFilter}
                                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Filter
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {reportConfig.filters.map(filter => (
                                    <div key={filter.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <select
                                            value={filter.field}
                                            onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
                                            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                                        >
                                            <option value="">Select field</option>
                                            {getFieldOptions().map(field => (
                                                <option key={field.id} value={field.id}>{field.name}</option>
                                            ))}
                                        </select>
                                        
                                        <select
                                            value={filter.operator}
                                            onChange={(e) => updateFilter(filter.id, { operator: e.target.value })}
                                            className="border border-gray-300 rounded-md px-3 py-2"
                                        >
                                            <option value="equals">Equals</option>
                                            <option value="not_equals">Not Equals</option>
                                            <option value="contains">Contains</option>
                                            <option value="starts_with">Starts With</option>
                                            <option value="ends_with">Ends With</option>
                                            <option value="greater_than">Greater Than</option>
                                            <option value="less_than">Less Than</option>
                                            <option value="between">Between</option>
                                        </select>
                                        
                                        <input
                                            type="text"
                                            value={filter.value}
                                            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                                            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Enter value"
                                        />
                                        
                                        <button
                                            onClick={() => removeFilter(filter.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visualizations */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Visualizations</h3>
                                <div className="flex gap-2">
                                    {visualizationTypes.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => addVisualization(type)}
                                            className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            <type.icon className="h-4 w-4" />
                                            {type.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {reportConfig.visualizations.map(viz => (
                                    <div key={viz.id} className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium">{viz.title}</h4>
                                            <button
                                                onClick={() => removeVisualization(viz.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{viz.description}</p>
                                        <div className="text-xs text-gray-500">
                                            Type: {viz.type} | Fields: {viz.fields.length}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-4">
                <button
                    onClick={() => onPreview && onPreview(reportConfig)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    <Eye className="h-4 w-4" />
                    Preview
                </button>
                <button
                    onClick={() => onSave && onSave(reportConfig)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <Save className="h-4 w-4" />
                    Save Template
                </button>
                <button
                    onClick={() => onGenerate && onGenerate(reportConfig)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    <Download className="h-4 w-4" />
                    Generate Report
                </button>
            </div>
        </div>
    );
};

export default CustomReportBuilder;
