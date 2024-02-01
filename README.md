# onrender-wakeup

### Веб-сервис для поддержания работы серверов на onrender

Что нужно сделать:

- установить данные серверов в ./data
- задеплоить этот проект как Static Site
- настроить CORS на поднимаемых сайтах

### Настройки сервиса | Environment Variables

| Environment Variables | Value                                                                           |
| --------------------- | ------------------------------------------------------------------------------- |
| TIMER_DELAY           | `870000`                                                                        |
| SERVERS_DATA          | `[{name:'service-name',endpoint:'https://your-website.onrender.com/api/path'}]` |
