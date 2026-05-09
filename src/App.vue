<template>
  <div class="container">
    <h1>📝 My Doing and Evrything In this </h1>

    <div class="input-box">
      <input
        v-model="newTask"
        @keyup.enter="addTask"
        placeholder="Add a new task..."
        :class="{ 'error': showError }"
      />
      <button @click="addTask" class="add-btn">Add</button>
    </div>

    <div v-if="showError" class="error-message">
      {{ errorMessage }}
    </div>

    <ul>
      <li
        v-for="task in tasks"
        :key="task.id"
      >
        <span>
          {{ task.text }}
        </span>

        <div class="todo-meta">
          {{ formatDate(task.created_at) }}
        </div>

        <button class="delete" @click="removeTask(task)">
          ✕
        </button>
      </li>
    </ul>

    <p v-if="tasks.length === 0" class="empty">
      No tasks yet. Add one!
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './utils/supabase'

const newTask = ref("")
const tasks = ref([])
const errorMessage = ref("")
const showError = ref(false)

// Add task
async function addTask() {
  const text = newTask.value.trim()
  if (text === "") {
    errorMessage.value = "Please enter a task before adding!"
    showError.value = true
    shakeInput()
    setTimeout(() => {
      showError.value = false
    }, 3000)
    return
  }

  const { error } = await supabase
    .from('todos')
    .insert({ text })

  if (error) {
    errorMessage.value = "Error adding task!"
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 3000)
    return
  }

  newTask.value = ""
  errorMessage.value = ""
  showError.value = false
  await getTodos()
}


// Remove task (soft delete)
async function removeTask(task) {
  const { error } = await supabase
    .from('todos')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', task.id)
  
  if (!error) {
    await getTodos()
  }
}

// Get todos from Supabase
async function getTodos() {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      errorMessage.value = "Error loading todos: " + error.message
      showError.value = true
    } else {
      tasks.value = data || []
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    errorMessage.value = "Connection error. Please check your setup."
    showError.value = true
  }
}

// Shake animation for input
function shakeInput() {
  const inputElement = document.querySelector('input')
  if (inputElement) {
    inputElement.classList.add('shake')
    setTimeout(() => {
      inputElement.classList.remove('shake')
    }, 500)
  }
}

// Test database connection
async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connectivity
    const { data, error } = await supabase
      .from('todos')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Connection test failed:', error)
      return {
        success: false,
        error: error.message,
        details: error
      }
    } else {
      console.log('Connection successful!')
      return {
        success: true,
        message: 'Database connected successfully',
        data: data
      }
    }
  } catch (err) {
    console.error('Connection test error:', err)
    return {
      success: false,
      error: 'Network error',
      details: err
    }
  }
}

// Check if table exists
async function checkTableExists() {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .limit(1)
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { exists: false, error: 'Table does not exist' }
      }
      return { exists: false, error: error.message }
    }
    
    return { exists: true, message: 'Table exists and accessible' }
  } catch (err) {
    return { exists: false, error: 'Connection failed' }
  }
}

// Format date function
function formatDate(dateString) {
  if (!dateString) return 'No date'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Load todos on component mount
onMounted(async () => {
  console.log('App mounted, checking database connection...')
  
  // Test connection first
  const connectionTest = await testConnection()
  console.log('Connection test result:', connectionTest)
  
  // Check if table exists
  const tableCheck = await checkTableExists()
  console.log('Table check result:', tableCheck)
  
  // Load todos if everything is working
  if (connectionTest.success && tableCheck.exists) {
    await getTodos()
  } else {
    errorMessage.value = "Database connection issue. Please check console for details."
    showError.value = true
  }
})
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 60px auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

h1 {
  margin-bottom: 20px;
  color: white;
  font-size: 2.2rem;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.input-box {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 30px;
}

input {
  padding: 12px 16px;
  width: 70%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: white;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

button {
  padding: 12px 20px;
  cursor: pointer;
  border: none;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  margin: 12px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(148, 163, 184, 0.3);
}

li:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

li span {
  color: #000000;
  font-size: 16px;
  flex: 1;
  text-align: left;
  padding-right: 15px;
}

.todo-meta {
  font-size: 12px;
  color: #64748b;
  opacity: 0.7;
  margin-left: 10px;
  font-style: italic;
}

.delete {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border: none;
  color: white;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(238, 90, 36, 0.3);
}

.delete:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(238, 90, 36, 0.4);
}

.error-message {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 10px 15px;
  margin: 10px 0;
  font-size: 14px;
  animation: slideIn 0.3s ease-out;
}

input.error {
  border-color: #ff6b6b !important;
  box-shadow: 0 0 10px rgba(255, 107, 107, 0.3) !important;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.shake {
  animation: shake 0.5s ease-in-out;
}

.add-btn:active {
  transform: scale(0.95);
}

.empty {
  color: rgba(255, 255, 255, 0.8);
  margin-top: 30px;
  font-size: 18px;
  font-style: italic;
}
</style>