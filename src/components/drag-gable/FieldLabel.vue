<template>
  <div class="btn-group">
      <button
        type="button"
        class="btn btn-draggable"
        :class="`btn-${variant}`">
        {{ field.label }}
      </button>
    </div>
</template>

<script>
export default {
  model: {
    prop: 'fieldValues',
  },
  props: {
    fieldValues: {
      type: Array,
    },
    field: {
      type: Object,
    },
    variant: {
      type: String,
      default: 'primary',
    },
  },
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
</style>
