# QA Auto Engineer JavaScript Project

[![Hexlet Check](https://github.com/gybins/qa-auto-engineer-javascript-project-90/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/gybins/qa-auto-engineer-javascript-project-90/actions/workflows/hexlet-check.yml)
[![Playwright Tests](https://github.com/gybins/qa-auto-engineer-javascript-project-90/actions/workflows/playwright.yml/badge.svg)](https://github.com/gybins/qa-auto-engineer-javascript-project-90/actions/workflows/playwright.yml)

## Описание проекта

Учебный проект по автоматизации тестирования веб-приложения Task Manager.

Автоматизированные тесты написаны на JavaScript с использованием Playwright.

Проект включает end-to-end тесты для проверки основных функций приложения:

- Авторизация и выход из системы
- Управление пользователями
- Создание и управление метками
- Создание и управление статусами
- Создание, фильтрация, редактирование, удаление и перемещение задач


## Требования

Для работы с проектом необходимы:

- Node.js
- npm
- Make

## Установка

Клонировать репозиторий:

```bash
git clone https://github.com/gybins/qa-auto-engineer-javascript-project-90.git
```

Перейти в директорию проекта:

```bash
cd qa-auto-engineer-javascript-project-90
```

Установить зависимости:

```bash
make install
```

## Запуск приложения

Для локального запуска приложения:

```bash
make dev
```

## Запуск тестов

Для запуска автоматизированных тестов Playwright:

```bash
make test
```

Приложение запускается автоматически перед выполнением тестов.

## Проверка линтером

Для проверки качества кода:

```bash
make lint
```


