<script setup>
definePageMeta({
  layout: false,
  middleware: ["guest"],
});

useHead({
  title: "Register",
});

const formData = reactive({ name: "", username: "", email: "", password: "" });
const errors = reactive({ name: "", username: "", email: "", password: "" });

const isSubmitting = ref(false);
const generalError = ref("");

// Simple email regex for client-side check
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registrationState = useState("registration_status", () => null);

const submitForm = async () => {
  // Reset error
  errors.name = "";
  errors.username = "";
  errors.email = "";
  errors.password = "";
  generalError.value = "";

  let isValid = true;

  // Validate Name
  if (!formData.name.trim()) {
    errors.name = "Name can not be empty";
    isValid = false;
  }

  // Validate Username
  if (!formData.username.trim()) {
    errors.username = "Username can not be empty";
    isValid = false;
  }

  // Validate Email
  if (!formData.email.trim()) {
    errors.email = "Email can not be empty";
    isValid = false;
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  }

  // Validate Password
  if (!formData.password) {
    errors.password = "Password can not be empty";
    isValid = false;
  }

  if (!isValid) return;

  isSubmitting.value = true;

  // Process Input and continue
  try {
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      },
    });

    if (response.success) {
      registrationState.value = {
        success: true,
        message: "Registration success! Please login with your created account.",
      };
      await navigateTo("/auth/login", { replace: true });
    }
  } catch (err) {
    if (err?.statusCode === 400 && err?.data?.data?.issues) {
      generalError.value = err.data.data.issues[0]?.message || "Invalid input data.";
    } else {
      generalError.value = err?.data?.statusMessage || err?.data?.message || "An unexpected error occurred.";
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Clear Error on type
watch(
  () => formData.username,
  (newValue) => {
    if (newValue.trim()) errors.username = "";
  },
);
watch(
  () => formData.email,
  (newValue) => {
    if (newValue.trim()) errors.email = "";
  },
);
watch(
  () => formData.password,
  (newValue) => {
    if (newValue) errors.password = "";
  },
);
</script>
<template>
  <div class="min-h-screen bg-white flex flex-col">
    <header class="border-b border-gray-100 px-6 py-4">
      <NuxtLink to="/" class="mx-auto flex items-center gap-3 group">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center shadow-sm">
          <span class="text-white text-lg">❓</span>
        </div>
        <span class="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors"> Trivio </span>
      </NuxtLink>
    </header>

    <main class="flex-1 flex items-center justify-center px-6 py-16">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <div class="text-5xl mb-4">🎯</div>
          <h1 class="text-3xl font-extrabold text-gray-900 mb-2">Welcome to Trivio</h1>
          <p class="text-gray-500 text-sm">Enter new username, email and password to start playing and track your scores.</p>
        </div>

        <div v-if="generalError" class="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
          {{ generalError }}
        </div>

        <form v-on:submit.prevent="submitForm" class="space-y-4">
          <div>
            <AuthInput id="name" label="Name" placeholder="e.g. Maximus" v-model="formData.name" :required="true" :error="errors.name" />
          </div>

          <div>
            <AuthInput id="username" label="Username" placeholder="e.g. QuizMaster99" v-model="formData.username" :required="true" :error="errors.username" />
          </div>

          <div>
            <AuthInput id="email" label="Email" placeholder="e.g. quizmaster99@gmail.com" v-model="formData.email" :required="true" :error="errors.email" />
          </div>

          <div>
            <AuthInput id="password" type="password" label="Password" placeholder="e.g. ********" v-model="formData.password" :required="true" :error="errors.password" />
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3.5 rounded-xl text-base font-bold bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="isSubmitting">Creating account...</span>
            <span v-else>Register →</span>
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Already have an account?
          <NuxtLink to="/auth/login" class="font-semibold text-emerald-600 hover:underline">Sign in</NuxtLink>
        </p>
      </div>
    </main>
  </div>
</template>
