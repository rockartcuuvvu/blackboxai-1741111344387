// AI Student Class
class AIStudent {
    constructor(name, iq, personality, learningStyle, strengths, weaknesses) {
        try {
            this.name = name;
            this.iq = iq;
            this.personality = personality;
            this.learningStyle = learningStyle;
            this.strengths = strengths;
            this.weaknesses = weaknesses;
            this.grades = {
                languages: { home: 0, first: 0 },
                mathematics: 0,
                lifeOrientation: 0,
                subjects: {}
            };
            this.sbaComponents = {
                tests: [],
                assignments: [],
                projects: [],
                practicals: []
            };
        } catch (error) {
            console.error('Error creating student:', error);
            throw error;
        }
    }

    // Calculate response based on personality and IQ
    respondToQuestion(subject, difficulty) {
        try {
            const baseChance = (this.iq - 70) / 100; // normalize IQ to 0-1 scale
            const strengthBonus = this.strengths.includes(subject) ? 0.2 : 0;
            const weaknessBonus = this.weaknesses.includes(subject) ? -0.2 : 0;
            
            return Math.min(1, Math.max(0, baseChance + strengthBonus + weaknessBonus));
        } catch (error) {
            console.error('Error calculating response:', error);
            return 0; // Return minimum score on error
        }
    }

    // Submit assignment with personality influence
    submitAssignment(subject, type, difficulty) {
        try {
            const baseScore = this.respondToQuestion(subject, difficulty);
            let personalityModifier = 0;

            switch(this.personality) {
                case 'Perfectionist':
                    personalityModifier = 0.1;
                    break;
                case 'Procrastinator':
                    personalityModifier = -0.1;
                    break;
                case 'Creative':
                    personalityModifier = subject === 'Arts' ? 0.15 : 0;
                    break;
                case 'Analytical':
                    personalityModifier = subject === 'Mathematics' ? 0.15 : 0;
                    break;
                case 'Social':
                    personalityModifier = subject === 'Languages' ? 0.1 : 0;
                    break;
                case 'Determined':
                    personalityModifier = 0.05;
                    break;
                case 'Organized':
                    personalityModifier = 0.08;
                    break;
                case 'Laid-back':
                    personalityModifier = -0.05;
                    break;
            }

            const finalScore = Math.min(100, Math.max(0, baseScore * 100 + personalityModifier * 100));
            
            this.sbaComponents[type].push({
                subject,
                score: finalScore,
                date: new Date()
            });

            return finalScore;
        } catch (error) {
            console.error('Error submitting assignment:', error);
            return 0; // Return minimum score on error
        }
    }
}

// Create AI Students
const students = [
    new AIStudent(
        "Sarah",
        128,
        "Analytical",
        "Visual",
        ["Mathematics", "Physical Sciences"],
        ["Creative Writing"]
    ),
    new AIStudent(
        "James",
        115,
        "Creative",
        "Auditory",
        ["Languages", "Life Orientation"],
        ["Mathematics"]
    ),
    new AIStudent(
        "Thabo",
        120,
        "Perfectionist",
        "Kinesthetic",
        ["Physical Sciences", "Life Sciences"],
        ["Languages"]
    ),
    new AIStudent(
        "Lerato",
        118,
        "Social",
        "Visual",
        ["Languages", "History"],
        ["Mathematics"]
    ),
    new AIStudent(
        "Michael",
        110,
        "Procrastinator",
        "Auditory",
        ["Geography", "Life Orientation"],
        ["Physical Sciences"]
    ),
    new AIStudent(
        "Priya",
        125,
        "Determined",
        "Reading/Writing",
        ["Mathematics", "Accounting"],
        ["Physical Education"]
    ),
    new AIStudent(
        "David",
        112,
        "Laid-back",
        "Kinesthetic",
        ["Life Orientation", "Physical Education"],
        ["History"]
    ),
    new AIStudent(
        "Zinhle",
        122,
        "Organized",
        "Visual",
        ["Life Sciences", "Languages"],
        ["Geography"]
    )
];

// Global state
const state = {
    assignments: [],
    classInProgress: false,
    logs: []
};

// Helper Functions
function addLog(message) {
    try {
        const timestamp = new Date().toLocaleTimeString();
        state.logs.unshift(`[${timestamp}] ${message}`);
        renderLogs();
    } catch (error) {
        console.error('Error adding log:', error);
    }
}

function renderLogs() {
    try {
        const logsContent = document.getElementById('logs-content');
        if (logsContent) {
            logsContent.innerHTML = state.logs
                .map(log => `<div class="text-sm">${log}</div>`)
                .join('');
        }
    } catch (error) {
        console.error('Error rendering logs:', error);
    }
}

function updateDashboardStats() {
    try {
        // Update total students
        document.getElementById('total-students').textContent = students.length;

        // Update active assignments
        document.getElementById('active-assignments').textContent = state.assignments.length;

        // Calculate and update average IQ
        const averageIQ = students.reduce((sum, student) => sum + student.iq, 0) / students.length;
        document.getElementById('average-class-iq').textContent = Math.round(averageIQ);

        // Calculate and update class performance
        const performance = calculateClassPerformance();
        document.getElementById('class-performance').textContent = `${Math.round(performance)}%`;

        // Update NSC progress bars
        updateNSCProgress();
    } catch (error) {
        console.error('Error updating dashboard:', error);
        addLog(`Error updating dashboard: ${error.message}`);
    }
}

function calculateClassPerformance() {
    try {
        let totalScore = 0;
        let totalAssignments = 0;

        students.forEach(student => {
            Object.values(student.sbaComponents).forEach(components => {
                components.forEach(component => {
                    totalScore += component.score;
                    totalAssignments++;
                });
            });
        });

        return totalAssignments > 0 ? (totalScore / totalAssignments) : 0;
    } catch (error) {
        console.error('Error calculating class performance:', error);
        return 0;
    }
}

function updateNSCProgress() {
    try {
        const subjects = {
            languages: calculateSubjectProgress('Languages'),
            mathematics: calculateSubjectProgress('Mathematics'),
            lifeOrientation: calculateSubjectProgress('Life Orientation')
        };

        document.getElementById('progress-languages').style.width = `${subjects.languages}%`;
        document.getElementById('progress-mathematics').style.width = `${subjects.mathematics}%`;
        document.getElementById('progress-lifeorientation').style.width = `${subjects.lifeOrientation}%`;
    } catch (error) {
        console.error('Error updating NSC progress:', error);
        addLog(`Error updating NSC progress: ${error.message}`);
    }
}

function calculateSubjectProgress(subject) {
    try {
        const relevantAssignments = state.assignments.filter(a => 
            a.subject.toLowerCase().includes(subject.toLowerCase())
        );
        if (relevantAssignments.length === 0) return 0;

        const scores = [];
        relevantAssignments.forEach(assignment => {
            students.forEach(student => {
                const components = student.sbaComponents[assignment.type + 's'];
                const matchingAssignment = components.find(a => a.subject === assignment.subject);
                if (matchingAssignment) {
                    scores.push(matchingAssignment.score);
                }
            });
        });

        return scores.length > 0 
            ? scores.reduce((sum, score) => sum + score, 0) / scores.length
            : 0;
    } catch (error) {
        console.error('Error calculating subject progress:', error);
        return 0;
    }
}

function getRandomColor() {
    try {
        const colors = ['indigo', 'green', 'blue', 'purple', 'pink'];
        return colors[Math.floor(Math.random() * colors.length)];
    } catch (error) {
        console.error('Error getting random color:', error);
        return 'indigo'; // Default fallback color
    }
}

function renderStudents() {
    try {
        const studentList = document.getElementById('student-list');
        if (!studentList) return;

        studentList.innerHTML = students.map((student, index) => `
            <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-${getRandomColor()}-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-${getRandomColor()}-600"></i>
                        </div>
                        <div class="ml-4">
                            <h3 class="font-semibold">${student.name}</h3>
                            <p class="text-sm text-gray-500">IQ: ${student.iq}</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="openEditModal(${index})" class="p-2 text-blue-600 hover:text-blue-800">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteStudent(${index})" class="p-2 text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="space-y-2">
                    <p class="text-sm"><span class="font-medium">Personality:</span> ${student.personality}</p>
                    <p class="text-sm"><span class="font-medium">Learning Style:</span> ${student.learningStyle}</p>
                    <p class="text-sm"><span class="font-medium">Strengths:</span> ${student.strengths.join(', ')}</p>
                    <p class="text-sm"><span class="font-medium">Weaknesses:</span> ${student.weaknesses.join(', ')}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error rendering students:', error);
        addLog(`Error rendering students: ${error.message}`);
    }
}

function renderAssignments() {
    try {
        const assignmentsList = document.getElementById('assignments-list');
        if (!assignmentsList) return;

        if (state.assignments.length === 0) {
            assignmentsList.innerHTML = '<p class="text-gray-500">No assignments yet</p>';
            return;
        }

        assignmentsList.innerHTML = state.assignments.map(assignment => `
            <div class="border-l-4 border-${getRandomColor()}-500 pl-4">
                <h3 class="font-semibold">${assignment.subject}</h3>
                <p class="text-sm text-gray-500">Due: ${assignment.dueDate.toLocaleDateString()}</p>
                <div class="mt-2">
                    <span class="text-xs bg-${getRandomColor()}-100 text-${getRandomColor()}-600 px-2 py-1 rounded">
                        ${assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)}
                    </span>
                    <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded ml-2">
                        Difficulty: ${assignment.difficulty}/10
                    </span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error rendering assignments:', error);
        addLog(`Error rendering assignments: ${error.message}`);
    }
}

// Event Handlers
function handleAssignmentSubmit(event) {
    try {
        event.preventDefault();
        const subject = document.getElementById('assignment-subject').value;
        const type = document.getElementById('assignment-type').value;
        const difficulty = parseInt(document.getElementById('assignment-difficulty').value);

        // Validate inputs
        if (!subject || !type || isNaN(difficulty) || difficulty < 1 || difficulty > 10) {
            throw new Error('Please fill all fields correctly');
        }

        // Create new assignment
        const assignment = {
            subject,
            type,
            difficulty,
            dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
        };

        // Add to state
        state.assignments.push(assignment);

        // Simulate student responses
        students.forEach(student => {
            const score = student.submitAssignment(subject, type + 's', difficulty);
            addLog(`${student.name} completed ${subject} ${type} with score: ${Math.round(score)}%`);
        });

        // Update UI
        renderAssignments();
        updateDashboardStats();
        updateEnhancedAnalytics();
        
        // Reset form
        event.target.reset();
        document.getElementById('assignment-error').classList.add('hidden');
        
        addLog(`New ${type} created: ${subject}`);
    } catch (error) {
        document.getElementById('assignment-error').textContent = error.message;
        document.getElementById('assignment-error').classList.remove('hidden');
    }
}

function simulateExam() {
    try {
        if (!state.classInProgress) {
            addLog('Cannot simulate exam: Class is not in session');
            return;
        }

        addLog('Starting exam simulation...');
        
        students.forEach(student => {
            const examScore = student.submitAssignment('Exam', 'tests', 8);
            addLog(`${student.name} completed exam with score: ${Math.round(examScore)}%`);
        });

        updateDashboardStats();
        updateEnhancedAnalytics();
        addLog('Exam simulation completed');
    } catch (error) {
        console.error('Error simulating exam:', error);
        addLog(`Error simulating exam: ${error.message}`);
    }
}

function toggleClass() {
    try {
        state.classInProgress = !state.classInProgress;
        const btn = document.getElementById('btn-start-class');
        
        if (state.classInProgress) {
            btn.innerHTML = '<i class="fas fa-stop mr-2"></i>End Class';
            btn.classList.remove('bg-white', 'text-indigo-600');
            btn.classList.add('bg-red-500', 'text-white', 'hover:bg-red-600');
            addLog('Class started');
        } else {
            btn.innerHTML = '<i class="fas fa-play mr-2"></i>Start Class';
            btn.classList.remove('bg-red-500', 'text-white', 'hover:bg-red-600');
            btn.classList.add('bg-white', 'text-indigo-600');
            addLog('Class ended');
        }
    } catch (error) {
        console.error('Error toggling class:', error);
        addLog(`Error toggling class: ${error.message}`);
    }
}

function toggleLogs() {
    try {
        const logsContainer = document.getElementById('teacher-logs');
        if (!logsContainer) {
            throw new Error('Logs container not found');
        }
        logsContainer.classList.toggle('hidden');
    } catch (error) {
        console.error('Error toggling logs:', error);
        addLog(`Error toggling logs: ${error.message}`);
    }
}

// Student Management Functions
function openEditModal(studentIndex) {
    try {
        const student = students[studentIndex];
        const modal = document.getElementById('edit-student-modal');
        
        // Populate form fields
        document.getElementById('edit-student-id').value = studentIndex;
        document.getElementById('edit-student-name').value = student.name;
        document.getElementById('edit-student-iq').value = student.iq;
        document.getElementById('edit-student-personality').value = student.personality;
        document.getElementById('edit-student-learning-style').value = student.learningStyle;
        document.getElementById('edit-student-strengths').value = student.strengths.join(', ');
        document.getElementById('edit-student-weaknesses').value = student.weaknesses.join(', ');
        
        // Show modal
        modal.classList.remove('hidden');
        addLog(`Opened edit modal for student: ${student.name}`);
    } catch (error) {
        console.error('Error opening edit modal:', error);
        addLog(`Error opening edit modal: ${error.message}`);
    }
}

function closeEditModal() {
    try {
        const modal = document.getElementById('edit-student-modal');
        modal.classList.add('hidden');
        document.getElementById('edit-student-form').reset();
    } catch (error) {
        console.error('Error closing edit modal:', error);
        addLog(`Error closing edit modal: ${error.message}`);
    }
}

function handleEditFormSubmit(event) {
    try {
        event.preventDefault();
        const studentIndex = parseInt(document.getElementById('edit-student-id').value);
        const student = students[studentIndex];
        
        // Update student data
        student.name = document.getElementById('edit-student-name').value;
        student.iq = parseInt(document.getElementById('edit-student-iq').value);
        student.personality = document.getElementById('edit-student-personality').value;
        student.learningStyle = document.getElementById('edit-student-learning-style').value;
        student.strengths = document.getElementById('edit-student-strengths').value.split(',').map(s => s.trim());
        student.weaknesses = document.getElementById('edit-student-weaknesses').value.split(',').map(s => s.trim());
        
        // Update UI
        renderStudents();
        updateDashboardStats();
        updateEnhancedAnalytics();
        closeEditModal();
        
        addLog(`Updated student profile: ${student.name}`);
    } catch (error) {
        console.error('Error updating student:', error);
        addLog(`Error updating student: ${error.message}`);
    }
}

function deleteStudent(studentIndex) {
    try {
        const student = students[studentIndex];
        if (confirm(`Are you sure you want to remove ${student.name} from the class?`)) {
            students.splice(studentIndex, 1);
            renderStudents();
            updateDashboardStats();
            updateEnhancedAnalytics();
            addLog(`Removed student: ${student.name}`);
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        addLog(`Error deleting student: ${error.message}`);
    }
}

// Enhanced Analytics Functions
function updateEnhancedAnalytics() {
    try {
        // Calculate completion rate
        const totalAssignments = state.assignments.length * students.length;
        let completedAssignments = 0;
        students.forEach(student => {
            Object.values(student.sbaComponents).forEach(components => {
                completedAssignments += components.length;
            });
        });
        const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;
        
        // Calculate average assignment score
        let totalScore = 0;
        let scoreCount = 0;
        students.forEach(student => {
            Object.values(student.sbaComponents).forEach(components => {
                components.forEach(component => {
                    totalScore += component.score;
                    scoreCount++;
                });
            });
        });
        const averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;
        
        // Calculate class engagement (based on assignment completion and performance)
        const engagementScore = (completionRate + (averageScore || 0)) / 2;
        
        // Update UI
        document.getElementById('completion-rate').textContent = `${Math.round(completionRate)}%`;
        document.getElementById('avg-assignment-score').textContent = `${Math.round(averageScore)}%`;
        document.getElementById('class-engagement').textContent = `${Math.round(engagementScore)}%`;
    } catch (error) {
        console.error('Error updating analytics:', error);
        addLog(`Error updating analytics: ${error.message}`);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Render initial state
        renderStudents();
        renderAssignments();
        updateDashboardStats();
        updateEnhancedAnalytics();

        // Add event listeners
        document.getElementById('assignment-form').addEventListener('submit', handleAssignmentSubmit);
        document.getElementById('btn-start-class').addEventListener('click', toggleClass);
        document.getElementById('btn-simulate-exam').addEventListener('click', simulateExam);
        document.getElementById('btn-view-logs').addEventListener('click', toggleLogs);
        document.getElementById('btn-manage-students').addEventListener('click', () => {
            addLog('Opened student management view');
        });
        document.getElementById('edit-student-form').addEventListener('submit', handleEditFormSubmit);
        document.getElementById('btn-cancel-edit').addEventListener('click', closeEditModal);

        // Add initial log
        addLog('Classroom initialized with enhanced student management');
    } catch (error) {
        console.error('Error during initialization:', error);
        addLog(`Error during initialization: ${error.message}`);
    }
});
