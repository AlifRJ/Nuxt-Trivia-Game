<script setup>
definePageMeta({
  layout: false,
  middleware: ["guest"],
});

useHead({
  title: "Sign In",
});

// Nuxt Auth Utils session composable
const { fetch: fetchUserSession } = useUserSession();

const formData = reactive({ identity: "", password: "" });
const errors = reactive({ identity: "", password: "" });

const isSubmitting = ref(false);
const generalError = ref("");

const submitForm = async () => {
  // Reset error
  errors.identity = "";
  errors.password = "";
  generalError.value = "";

  let isValid = true;

  // Validate identity
  if (!formData.identity.trim()) {
    errors.identity = "Username or Email can not be empty";
    isValid = false;
  }

  // Validate password
  if (!formData.password) {
    errors.password = "Password can not be empty";
    isValid = false;
  }

  if (!isValid) return;

  isSubmitting.value = true;

  // Process Input and continue
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: formData,
    });

    if (response.success) {
      await fetchUserSession();
      await navigateTo("/", { replace: true });
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
  () => formData.identity,
  (newValue) => {
    if (newValue.trim()) errors.identity = "";
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
          <p class="text-gray-500 text-sm">Enter your username/email and password to start playing and track your scores.</p>
        </div>

        <!-- Server Error Alert -->
        <div v-if="generalError" class="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
          {{ generalError }}
        </div>

        <form v-on:submit.prevent="submitForm" class="space-y-4">
          <div>
            <AuthInput id="identity" label="Username/Email" placeholder="e.g. QuizMaster99 | quizmaster99@gmail.com" v-model="formData.identity" :required="true" :error="errors.identity" />
          </div>
          <div>
            <AuthInput id="password" type="password" label="Password" placeholder="e.g. ********" v-model="formData.password" :required="true" :error="errors.password" />
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3.5 rounded-xl text-base font-bold bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="isSubmitting">Signing in...</span>
            <span v-else>Let's Play →</span>
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-4">
          Don't have an account?
          <NuxtLink to="/auth/register" class="font-semibold text-emerald-600 hover:underline">Sign up</NuxtLink>
        </p>
      </div>
    </main>
  </div>
</template>
