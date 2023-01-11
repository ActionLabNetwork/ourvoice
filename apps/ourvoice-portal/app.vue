<template>
  <div
    class="container flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28"
  >
    <!-- Content -->
    <div class="flex flex-1 flex-col items-center lg:items-start">
      <h2
        class="text-ourvoice-blue text-3xl md:text-4 lg:text-5xl text-center lg:text-left mb-6"
      >
        <span class="text-ourvoice-red">Safe</span> digital space for
        <span class="text-ourvoice-red">workplace</span>-related discussion
      </h2>
      <p class="text-ourvoice-grey text-lg text-center lg:text-left mb-6">
        A safe space for employees and community members to anonymously discuss
        issues and concerns about their work environments.
      </p>
      <div class="flex justify-center flex-wrap gap-6">
        <button type="button" class="btn btn-purple btn-hover">
          Read More
        </button>
        <button type="button" class="btn btn-red btn-hover">Contact Us</button>
      </div>
    </div>
    <!-- Image -->
    <div class="flex justify-center flex-1 mb-10 md:mb-16 lg:mb-0 z-10">
      <img
        class="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full shadow-md"
        :src="'/img/hero_image.png'"
        alt="OurVoice interface"
      />
    </div>
  </div>
</template>

<script lang="ts"></script>
