// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', '@pinia/nuxt', '@nuxtjs/apollo'],
  typescript: {
    shim: false,
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint:
          'https://f6cad854-8dbf-4292-9309-d13053b3211f.mock.pstmn.io/graphql',
      },
    },
  },
})
