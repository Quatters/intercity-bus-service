<template>
  <b-navbar sticky variant="light" type="light" class="shadow-sm px-5">
    <b-navbar-nav class="ml-1">
      <b-nav-item-dropdown text="Справочники" left>
        <b-dropdown-item to="/admin/cities">Населенные пункты</b-dropdown-item>
        <b-dropdown-item to="/admin/routes">Маршруты</b-dropdown-item>
        <b-dropdown-item to="/admin/bus-models"
          >Модели автобусов</b-dropdown-item
        >
        <b-dropdown-item to="/admin/buses">Автобусы</b-dropdown-item>
        <b-dropdown-item to="/admin/schedule">Расписание</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {};
</script>

<style></style>
