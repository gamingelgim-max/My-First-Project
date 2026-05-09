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
        v-for="(task, index) in tasks"
        :key="index"
        :class="{ done: task.done }"
      >
        <span @click="toggleDone(index)">
          {{ task.text }}
        </span>

        <button class="delete" @click="removeTask(index)">
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
import { ref } from "vue"

const newTask = ref("")
const tasks = ref([])
const errorMessage = ref("")
const showError = ref(false)

// Add task
function addTask() {
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

  tasks.value.push({
    text,
    done: false
  })

  newTask.value = ""
  errorMessage.value = ""
  showError.value = false
}

// Toggle done
function toggleDone(index) {
  tasks.value[index].done = !tasks.value[index].done
}

// Remove task
function removeTask(index) {
  tasks.value.splice(index, 1)
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
  color: #2d3748;
  font-size: 16px;
  flex: 1;
  text-align: left;
}

li.done span {
  text-decoration: line-through;
  color: #a0aec0;
  opacity: 0.7;
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