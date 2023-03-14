<script setup lang="ts"></script>

<template>
  <main>
    <div class="container flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28">
      <!-- Content -->
      <div class="flex flex-1 flex-col items-center lg:items-start">
        <h1 class="text-ourvoice-blue text-5xl md:text-6 lg:text-6xl text-center lg:text-left mb-6">
          <span class="text-ourvoice-red">OurVoice</span> App
        </h1>
        <p class="text-ourvoice-grey text-lg text-center lg:text-left mb-6">
          A safe space for employees and community members to anonymously discuss issues and
          concerns about their work environments.
        </p>
        <div class="flex justify-center flex-wrap gap-6">
          <button type="button" class="btn btn-purple btn-hover">Login</button>
        </div>
      </div>
      <!-- Image -->
      <div class="flex justify-center flex-1 mb-10 md:mb-16 lg:mb-0 z-10">
        <img
          class="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full"
          src="@/assets/ourvoice_logo.svg"
          alt="OurVoice interface"
        />
      </div>
    </div>
  </main>
</template>
