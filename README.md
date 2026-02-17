# Osiris

[![Windows](https://github.com/danielkrupinski/Osiris/actions/workflows/windows.yml/badge.svg?branch=master&event=push)](https://github.com/danielkrupinski/Osiris/actions/workflows/windows.yml)
[![Linux](https://github.com/danielkrupinski/Osiris/actions/workflows/linux.yml/badge.svg?branch=master&event=push)](https://github.com/danielkrupinski/Osiris/actions/workflows/linux.yml)

Кроссплатформенный (Windows, Linux) игровой хак для **Counter-Strike 2** с GUI и рендерингом на базе Panorama UI игры. Совместим с последним обновлением игры в Steam.

## Что нового

* 4 ноября 2025
    * Улучшена плавность функции «Инфо об игроках в мире» для движущихся игроков

* 30 октября 2025
    * Добавлена функция предупреждения об установке бомбы
        * Зелёный цвет означает, что бомба будет установлена до конца раунда, если установку не прервут
        * Красный цвет означает, что бомбу нельзя установить до конца раунда

    <img width="201" height="146" alt="Bomb Plant Alert" src="https://github.com/user-attachments/assets/21c0f8fb-a20d-42df-9857-f578cfc9b9f9" />

* 23 октября 2025
    * Теперь можно настраивать оттенок контурного свечения заложников

* 20 октября 2025
    * Добавлена функция «Визуализация разброса без прицела»

    <img height="300" alt="no scope inaccuracy visualization" src="https://github.com/user-attachments/assets/860c944a-00b1-4b67-9d41-6f43e46f4252" />

* 9 октября 2025
    * Добавлена настройка FOV модели от первого лица

    ![Viewmodel fov modification](https://github.com/user-attachments/assets/3b9d6bde-a68c-4739-913c-d3b6caba4117)

## Технические особенности

* В релизных сборках не используется библиотека времени выполнения C++ (CRT)
* Нет выделений памяти в куче
* Нет статических импортов в релизной сборке на Windows
* Не создаются потоки
* Не используются исключения
* Нет внешних зависимостей

## Сборка

### Требования

#### Windows

* **Microsoft Visual Studio 2022** с установленной нагрузкой **Desktop development with C++**

#### Linux

* **CMake 3.24** или новее
* **g++ 11 или новее** либо **clang++ 18 или новее**

### Сборка из исходников

#### Windows

Откройте **Osiris.sln** в Visual Studio 2022, установите конфигурацию сборки **Release | x64**. Нажмите *Build solution* — на выходе получите файл **Osiris.dll**.

#### Linux

Сконфигурируйте проект с CMake:

    cmake -DCMAKE_BUILD_TYPE=Release -B build

Соберите проект:

    cmake --build build -j $(nproc --all)

После этих шагов вы получите файл **libOsiris.so** в директории **build/Source/**.

### Загрузка / инжект в процесс игры

#### Windows

Вам нужен **DLL-инжектор**, чтобы внедрить (загрузить) **Osiris.dll** в процесс игры.

Counter-Strike 2 блокирует метод инжекта через LoadLibrary, поэтому нужен инжектор с manual mapping (aka reflective DLL injection).

**Xenos** и **Extreme Injector** известны как **детектируемые** VAC.

#### Linux

Можно выполнить следующий скрипт в директории, где находится **libOsiris.so**:

    sudo gdb -batch-silent -p $(pidof cs2) -ex "call (void*)dlopen(\"$PWD/libOsiris.so\", 2)"

Однако этот метод инжекта может детектироваться VAC, так как gdb виден в **TracerPid** в `/proc/$(pidof cs2)/status` на время инжекта.

## FAQ

### Где на диске хранятся настройки?

В файле конфигурации `default.cfg` внутри директории `%appdata%\OsirisCS2\configs` на Windows и `$HOME/OsirisCS2/configs` на Linux.

## Лицензия

> Copyright (c) 2018-2025 Daniel Krupiński

Проект распространяется по лицензии [MIT License](https://opensource.org/licenses/mit-license.php). Подробнее см. в файле [LICENSE](https://github.com/danielkrupinski/Osiris/blob/master/LICENSE).

