<template>
  <b-navbar sticky variant="light" type="light" class="shadow-sm px-5">
    <b-collapse is-nav class="ml-1">
      <b-navbar-nav>
        <b-nav-item-dropdown text="Справочники" left>
          <b-dropdown-item to="/admin/cities"
            >Населенные пункты</b-dropdown-item
          >
          <b-dropdown-item to="/admin/routes">Маршруты</b-dropdown-item>
          <b-dropdown-item to="/admin/bus-models"
            >Модели автобусов</b-dropdown-item
          >
          <b-dropdown-item to="/admin/buses">Автобусы</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-navbar-nav class="ml-4">
        <b-nav-item to="/admin/schedule">Расписание</b-nav-item>
        <b-nav-text>|</b-nav-text>
        <b-nav-item to="/admin/flights">Рейсы</b-nav-item>
        <b-nav-text>|</b-nav-text>
        <b-nav-item to="/admin/tickets">Билеты</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown text="Отчетность" right>
          <b-dropdown-item to="/admin/reports/statistics"
            >Статистика по рейсам</b-dropdown-item
          >
          <b-dropdown-item to="/admin/reports/schedule"
            >Расписание маршрута</b-dropdown-item
          >
          <b-dropdown-item to="/admin/reports/popular-routes"
            >Популярные маршруты</b-dropdown-item
          >
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {};
</script>
