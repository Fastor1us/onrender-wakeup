# onrender-wakeup

### Веб-сервис для поддержания работы серверов на onrender

Что нужно сделать:

- задеплоить этот проект как Static Site
- добавить переменные окружения
- настроить CORS на поднимаемых сайтах

### Переменные окружения | Environment Variables

| Environment Variables | Value                                                                           |
| --------------------- | ------------------------------------------------------------------------------- |
| VUE_APP_TIMER_DELAY   | `870000`                                                                        |
| VUE_APP_SERVERS_DATA  | `[{name:'service-name',endpoint:'https://your-website.onrender.com/api/path'}]` |
