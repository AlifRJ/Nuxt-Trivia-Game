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

const registrationState = useState("registration_status", () => null);
const alertData = ref(null);
onMounted(() => {
  if (registrationState.value?.success) {
    alertData.value = registrationState.value.message;

    registrationState.value = null;
  }
});
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

        <!-- Alert Box Banner -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="alertData" class="mb-4 flex items-start p-4 text-emerald-800 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm" role="alert">
            <!-- Icon Success -->
            <svg class="flex-shrink-0 inline w-5 h-5 me-3 mt-0.5 text-emerald-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>

            <!-- Content Message -->
            <div class="flex-1 text-sm font-medium">
              <span class="font-semibold block mb-0.5">Register Success</span>
              {{ alertData }}
            </div>

            <!-- Close Button -->
            <button
              type="button"
              @click="alertData = null"
              class="ms-auto -mx-1.5 -my-1.5 bg-emerald-50 text-emerald-500 rounded-lg focus:ring-2 focus:ring-emerald-400 p-1.5 hover:bg-emerald-100 inline-flex items-center justify-center h-8 w-8"
              aria-label="Close"
            >
              <span class="sr-only">Close</span>
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>
        </Transition>

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
