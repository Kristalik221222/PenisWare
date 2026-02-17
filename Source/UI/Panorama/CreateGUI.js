u8R"(
$.Osiris = (function () {
  var activeTab;
  var activeSubTab = {};

  return {
    rootPanel: (function () {
      const rootPanel = $.CreatePanel('Panel', $.GetContextPanel(), 'OsirisMenuTab', {
        class: "mainmenu-content__container",
        useglobalcontext: "true"
      });

      rootPanel.visible = false;
      rootPanel.SetReadyForDisplay(false);
      rootPanel.RegisterForReadyEvents(true);
      $.RegisterEventHandler('PropertyTransitionEnd', rootPanel, function (panelName, propertyName) {
        if (rootPanel.id === panelName && propertyName === 'opacity') {
          if (rootPanel.visible === true && rootPanel.BIsTransparent()) {
            rootPanel.visible = false;
            rootPanel.SetReadyForDisplay(false);
            return true;
          } else if (newPanel.visible === true) {
            $.DispatchEvent('MainMenuTabShown', 'OsirisMenuTab');
          }
        }
        return false;
      });

      return rootPanel;
    })(),
    goHome: function () {
      $.DispatchEvent('Activated', this.rootPanel.GetParent().GetParent().GetParent().FindChildInLayoutFile("MainMenuNavBarHome"), 'mouse');
    },
    addCommand: function (command, value = '') {
      var existingCommands = this.rootPanel.GetAttributeString('cmd', '');
      this.rootPanel.SetAttributeString('cmd', existingCommands + command + ' ' + value);
    },
    navigateToTab: function (tabID) {
      if (activeTab === tabID)
        return;

      if (activeTab) {
        var panelToHide = this.rootPanel.FindChildInLayoutFile(activeTab);
        panelToHide.RemoveClass('Active');
      }

      this.rootPanel.FindChildInLayoutFile(tabID + '_button').checked = true;

      activeTab = tabID;
      var activePanel = this.rootPanel.FindChildInLayoutFile(tabID);
      activePanel.AddClass('Active');
      activePanel.visible = true;
      activePanel.SetReadyForDisplay(true);
    },
    navigateToSubTab: function (tabID, subTabID) {
      if (activeSubTab[tabID] === subTabID)
        return;

      if (activeSubTab[tabID]) {
        var panelToHide = this.rootPanel.FindChildInLayoutFile(activeSubTab[tabID]);
        panelToHide.RemoveClass('Active');
      }

      this.rootPanel.FindChildInLayoutFile(subTabID + '_button').checked = true;

      activeSubTab[tabID] = subTabID;
      var activePanel = this.rootPanel.FindChildInLayoutFile(subTabID);
      activePanel.AddClass('Active');
      activePanel.visible = true;
      activePanel.SetReadyForDisplay(true);
    },
    sliderUpdated: function (tabID, sliderID, slider) {
      this.addCommand('set', tabID + '/' + sliderID + '/' + Math.floor(slider.value));
    },
    sliderTextEntryUpdated: function (tabID, sliderID, panel) {
      this.addCommand('set', tabID + '/' + sliderID + '/' + panel.text);
    }
  };
})();

(function () {
  var createNavbar = function () {
    var navbar = $.CreatePanel('Panel', $.Osiris.rootPanel, '', {
      class: "content-navbar__tabs content-navbar__tabs--noflow"
    });

    var leftContainer = $.CreatePanel('Panel', navbar, '', {
      style: "horizontal-align: left; flow-children: right; height: 100%; margin-left: 15px;"
    });

    var activeCfgNameLabel = $.CreatePanel('Label', leftContainer, 'ActiveConfigName', {
      text: "default.cfg"
    });

    activeCfgNameLabel.SetPanelEvent('onmouseover', function () { UiToolkitAPI.ShowTextTooltip('ActiveConfigName', 'Активный файл конфигурации. Изменения сохраняются автоматически.'); });
    activeCfgNameLabel.SetPanelEvent('onmouseout', function () { UiToolkitAPI.HideTextTooltip(); });

    var restoreDefaultsButton = $.CreatePanel('Button', leftContainer, 'RestoreDefaultsButton', {
      class: "content-navbar__tabs__btn",
      style: "margin-left: 5px;",
      onactivate: "UiToolkitAPI.ShowGenericPopupOneOptionCustomCancelBgStyle('Сбросить настройки', 'Вы уверены, что хотите восстановить настройки по умолчанию в активном файле конфигурации (default.cfg)?', '', 'СБРОСИТЬ', function() { $.Osiris.addCommand('restore_defaults'); }, 'НАЗАД', function() {}, 'dim');"
    });

    restoreDefaultsButton.SetPanelEvent('onmouseover', function () { UiToolkitAPI.ShowTextTooltip('RestoreDefaultsButton', 'Сбросить настройки'); });
    restoreDefaultsButton.SetPanelEvent('onmouseout', function () { UiToolkitAPI.HideTextTooltip(); });

    $.CreatePanel('Image', restoreDefaultsButton, '', {
      src: "s2r://panorama/images/icons/ui/recent.vsvg",
      texturewidth: "24"
    });
  
    var centerContainer = $.CreatePanel('Panel', navbar, '', {
      class: "content-navbar__tabs__center-container",
    });

    var combatTabButton = $.CreatePanel('RadioButton', centerContainer, 'combat_button', {
      group: "SettingsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToTab('combat');"
    });

    $.CreatePanel('Label', combatTabButton, '', { text: "Бой" });

    var hudTabButton = $.CreatePanel('RadioButton', centerContainer, 'hud_button', {
      group: "SettingsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToTab('hud');"
    });

    $.CreatePanel('Label', hudTabButton, '', { text: "HUD" });

    var visualsTabButton = $.CreatePanel('RadioButton', centerContainer, 'visuals_button', {
      group: "SettingsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToTab('visuals');"
    });

    $.CreatePanel('Label', visualsTabButton, '', { text: "Визуал" });
    
    var soundTabButton = $.CreatePanel('RadioButton', centerContainer, 'sound_button', {
      group: "SettingsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToTab('sound');"
    });

    $.CreatePanel('Label', soundTabButton, '', { text: "Звук" });

    var rightContainer = $.CreatePanel('Panel', navbar, '', {
        style: "horizontal-align: right; flow-children: right; height: 100%; margin-right: 70px;"
    });

    var unloadButton = $.CreatePanel('Button', rightContainer, 'UnloadButton', {
        class: "content-navbar__tabs__btn",
        onactivate: "UiToolkitAPI.ShowGenericPopupOneOptionCustomCancelBgStyle('Выгрузить Osiris', 'Вы уверены, что хотите выгрузить Osiris?', '', 'ВЫГРУЗИТЬ', function() { $.Osiris.goHome(); $.Osiris.addCommand('unload'); }, 'НАЗАД', function() {}, 'dim');"
    });

    unloadButton.SetPanelEvent('onmouseover', function () { UiToolkitAPI.ShowTextTooltip('UnloadButton', 'Выгрузить'); });
    unloadButton.SetPanelEvent('onmouseout', function () { UiToolkitAPI.HideTextTooltip(); });

    $.CreatePanel('Image', unloadButton, '', {
        src: "s2r://panorama/images/icons/ui/cancel.vsvg",
        texturewidth: "24",
        class: "negativeColor"
    });
  };

  var createVisualsNavbar = function () {
    var navbar = $.CreatePanel('Panel', $.Osiris.rootPanel.FindChildInLayoutFile('visuals'), '', {
      class: "content-navbar__tabs content-navbar__tabs--dark content-navbar__tabs--noflow"
    });

    var centerContainer = $.CreatePanel('Panel', navbar, '', {
      class: "content-navbar__tabs__center-container",
    });

    var playerInfoTabButton = $.CreatePanel('RadioButton', centerContainer, 'player_info_button', {
      group: "VisualsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToSubTab('visuals', 'player_info');"
    });

    $.CreatePanel('Label', playerInfoTabButton, '', { text: "Инфо об игроках в мире" });

    var outlineGlowTabButton = $.CreatePanel('RadioButton', centerContainer, 'outline_glow_button', {
      group: "VisualsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToSubTab('visuals', 'outline_glow');"
    });

    $.CreatePanel('Label', outlineGlowTabButton, '', { text: "Контурное свечение" });

    var modelGlowTabButton = $.CreatePanel('RadioButton', centerContainer, 'model_glow_button', {
        group: "VisualsNavBar",
        class: "content-navbar__tabs__btn",
        onactivate: "$.Osiris.navigateToSubTab('visuals', 'model_glow');"
    });

    $.CreatePanel('Label', modelGlowTabButton, '', { text: "Свечение моделей" });
  
    var viewmodelTabButton = $.CreatePanel('RadioButton', centerContainer, 'viewmodel_button', {
        group: "VisualsNavBar",
        class: "content-navbar__tabs__btn",
        onactivate: "$.Osiris.navigateToSubTab('visuals', 'viewmodel');"
    });

    $.CreatePanel('Label', viewmodelTabButton, '', { text: "Модель от первого лица" });
  };

  var createCombatNavbar = function () {
    var navbar = $.CreatePanel('Panel', $.Osiris.rootPanel.FindChildInLayoutFile('combat'), '', {
      class: "content-navbar__tabs content-navbar__tabs--dark content-navbar__tabs--noflow"
    });

    var centerContainer = $.CreatePanel('Panel', navbar, '', {
      class: "content-navbar__tabs__center-container",
    });

    var sniperRiflesTabButton = $.CreatePanel('RadioButton', centerContainer, 'sniper_rifles_button', {
      group: "CombatNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToSubTab('combat', 'sniper_rifles');"
    });

    $.CreatePanel('Label', sniperRiflesTabButton, '', { text: "Снайперские винтовки" });
  };

  createNavbar();

  var settingContent = $.CreatePanel('Panel', $.Osiris.rootPanel, 'SettingsMenuContent', {
    class: "full-width full-height"
  });

  var createTab = function(tabName) {
    var tab = $.CreatePanel('Panel', settingContent, tabName, {
      useglobalcontext: "true",
      class: "SettingsMenuTab"
    });

    var content = $.CreatePanel('Panel', tab, '', {
      class: "SettingsMenuTabContent vscroll"
    });
  
    return content;
  };

  var createVisualsTab = function() {
    var tab = $.CreatePanel('Panel', settingContent, 'visuals', {
      useglobalcontext: "true",
      class: "SettingsMenuTab"
    });

    createVisualsNavbar();

    var content = $.CreatePanel('Panel', tab, '', {
      class: "full-width full-height"
    });
  
    return content;
  };

  var createCombatTab = function() {
    var tab = $.CreatePanel('Panel', settingContent, 'combat', {
      useglobalcontext: "true",
      class: "SettingsMenuTab"
    });

    createCombatNavbar();

    var content = $.CreatePanel('Panel', tab, '', {
      class: "full-width full-height"
    });
  
    return content;
  };

  var createSubTab = function(tab, subTabName) {
    var subTab = $.CreatePanel('Panel', tab, subTabName, {
      useglobalcontext: "true",
      class: "SettingsMenuTab"
    });

    var content = $.CreatePanel('Panel', subTab, '', {
      class: "SettingsMenuTabContent vscroll"
    });
    return content;
  };

  var createSection = function(tab, sectionName) {
    var background = $.CreatePanel('Panel', tab, '', {
      class: "SettingsBackground"
    });

    var titleContainer = $.CreatePanel('Panel', background, '', {
      class: "SettingsSectionTitleContianer"
    });

    $.CreatePanel('Label', titleContainer, '', {
      class: "SettingsSectionTitleLabel",
      text: sectionName
    });

    var content = $.CreatePanel('Panel', background, '', {
      class: "top-bottom-flow full-width"
    });

    return content;
  };

  var createDropDown = function (parent, labelText, section, feature, options) {
    var container = $.CreatePanel('Panel', parent, '', {
      class: "SettingsMenuDropdownContainer"
    });

    $.CreatePanel('Label', container, '', {
      class: "half-width",
      text: labelText
    });

    var dropdown = $.CreatePanel('CSGOSettingsEnumDropDown', container, feature, { class: "PopupButton White" });

    for (let i = 0; i < options.length; ++i) {
      dropdown.AddOption($.CreatePanel('Label', dropdown, i, {
      value: i,
      text: options[i]
      }));
    }
  };

  var createOnOffDropDown = function (parent, labelText, section, feature) {
    createDropDown(parent, labelText, section, feature, ["Вкл", "Выкл"]);
  };

  var createYesNoDropDown = function (parent, labelText, section, feature) {
    createDropDown(parent, labelText, section, feature, ["Да", "Нет"]);
  };

  var separator = function (parent) {
    $.CreatePanel('Panel', parent, '', { class: "horizontal-separator" });
  };

  var makeFauxItemId = function (defIndex, paintKitId) {
    return (BigInt(0xF000000000000000) | BigInt(paintKitId << 16) | BigInt(defIndex))
  };

  var createPlayerModelGlowPreview = function (parent, id, labelId, playerModel, itemId) {
    var container = $.CreatePanel('Panel', parent, '', { style: 'flow-children: none;' });
    var previewPanel = $.CreatePanel('MapPlayerPreviewPanel', container, id, {
      map: "ui/buy_menu",
      camera: "cam_loadoutmenu_ct",
      "require-composition-layer": true,
      playermodel: playerModel,
      playername: "vanity_character",
      animgraphcharactermode: "buy-menu",
      player: true,
      mouse_rotate: false,
      sync_spawn_addons: true,
      "transparent-background": true,
      "pin-fov": "vertical",
      csm_split_plane0_distance_override: "250.0",
      style: "y: 5px; vertical-align: top; width: 300px; height: 300px; horizontal-align: center;"
    });
    previewPanel.EquipPlayerWithItem(itemId);
    $.CreatePanel('Label', container, labelId, { style: 'vertical-align: top; horizontal-align: center;' });
  };

  var createGrenadeModelGlowPreview = function (parent, id, defIndex) {
    var container = $.CreatePanel('Panel', parent, '', { style: 'width: 80px; overflow: clip;' });
    var panel = $.CreatePanel('MapItemPreviewPanel', container, id, {
      map: "ui/xpshop_item",
      camera: "camera_weapon_4",
      "require-composition-layer": true,
      player: false,
      initial_entity: "item",
      mouse_rotate: false,
      sync_spawn_addons: true,
      "transparent-background": true,
      "pin-fov": "vertical",
      style: "x: -10px; horizontal-align: center; width: 200px; height: 80px;"
    });
    panel.SetItemItemId(makeFauxItemId(defIndex, 0), {});
  };
)"
// split the string literal because MSVC does not support string literals longer than 16k chars - error C2026
u8R"(
  var createSlider = function (parent, name, id, min, max) {
    var container = $.CreatePanel('Panel', parent, '', {
      class: "SettingsMenuDropdownContainer"
    });

    $.CreatePanel('Label', container, '', {
      class: "half-width",
      text: name
    });

    var sliderContainer = $.CreatePanel('Panel', container, id, {
      style: "vertical-align: center; horizontal-align: right; flow-children: right; margin-right: 8px;"
    });

    var slider = $.CreatePanel('Slider', sliderContainer, '', {
      class: "HorizontalSlider",
      style: "width: 200px; vertical-align: center;",
      direction: "horizontal"
    });

    slider.SetPanelEvent('onvaluechanged', function () { $.Osiris.sliderUpdated('visuals', id, slider); });
    slider.min = min;
    slider.max = max;
    slider.increment = 1.0;

    var textEntry = $.CreatePanel('TextEntry', sliderContainer, id + '_text', {
      maxchars: "3",
      textmode: "numeric",
      style: "width: 75px; margin-left: 10px; padding-left: 10px; text-align: center; font-size: 20px; color: #ccccccff; font-weight: bold; font-family: Stratum2, notosans, 'Arial Unicode MS'; border: 2px solid #cccccc15;"
    });

    textEntry.SetPanelEvent('ontextentrysubmit', function () { $.Osiris.sliderTextEntryUpdated('visuals', `${id}_text`, textEntry); });
    textEntry.SetPanelEvent('onfocus', function () { textEntry.style.backgroundColor = 'gradient(linear, 100% 0%, 0% 0%, from(#00000080), color-stop(0, #00000060), to(#00000080))'; });
    textEntry.SetPanelEvent('onblur', function () { textEntry.style.backgroundColor = 'none'; });
    textEntry.SetPanelEvent('onmouseover', function () { if (!textEntry.BHasKeyFocus()) textEntry.style.backgroundColor = 'gradient(linear, 100% 0%, 0% 0%, from(#000000ff), color-stop(0, #00000000), to(#00000050));'; });
    textEntry.SetPanelEvent('onmouseout', function () { if (!textEntry.BHasKeyFocus()) textEntry.style.backgroundColor = 'none'; });
  }

  var createHueSlider = function (parent, name, id, min, max) {
    var container = $.CreatePanel('Panel', parent, '', {
      class: "SettingsMenuDropdownContainer"
    });

    $.CreatePanel('Label', container, '', {
      class: "half-width",
      text: name
    });

    var sliderContainer = $.CreatePanel('Panel', container, id, {
      style: "vertical-align: center; horizontal-align: right; flow-children: right; margin-right: 8px;"
    });

    var slider = $.CreatePanel('Slider', sliderContainer, '', {
      class: "HorizontalSlider",
      style: "width: 200px; vertical-align: center;",
      direction: "horizontal"
    });

    slider.min = min;
    slider.max = max;
    slider.increment = 1.0;

    var textEntry = $.CreatePanel('TextEntry', sliderContainer, id + '_text', {
      maxchars: "3",
      textmode: "numeric",
      style: "width: 75px; margin-left: 10px; padding-left: 10px; text-align: center; font-size: 20px; color: #ccccccff; font-weight: bold; font-family: Stratum2, notosans, 'Arial Unicode MS'; border: 2px solid #cccccc15;"
    });

    textEntry.SetPanelEvent('onfocus', function () { textEntry.style.backgroundColor = 'gradient(linear, 100% 0%, 0% 0%, from(#00000080), color-stop(0, #00000060), to(#00000080))'; });
    textEntry.SetPanelEvent('onblur', function () { textEntry.style.backgroundColor = 'none'; });
    textEntry.SetPanelEvent('onmouseover', function () { if (!textEntry.BHasKeyFocus()) textEntry.style.backgroundColor = 'gradient(linear, 100% 0%, 0% 0%, from(#000000ff), color-stop(0, #00000000), to(#00000050));'; });
    textEntry.SetPanelEvent('onmouseout', function () { if (!textEntry.BHasKeyFocus()) textEntry.style.backgroundColor = 'none'; });

    $.CreatePanel('Panel', sliderContainer, id + '_color', {
        style: "border: 2px solid #000000a0; border-radius: 5px; margin-left: 10px; width: 25px; vertical-align: center; height: 25px;"
    });
  }
)"
// split the string literal because MSVC does not support string literals longer than 16k chars - error C2026
u8R"(
  var combat = createCombatTab();
  var sniperRiflesTab = createSubTab(combat, 'sniper_rifles');
  var noScope = createSection(sniperRiflesTab, 'Без прицела');
  separator(noScope);
  createYesNoDropDown(noScope, "Показывать разброс без использования прицела", 'combat', 'no_scope_inacc_vis');

  $.Osiris.navigateToSubTab('combat', 'sniper_rifles');

  var hud = createTab('hud');
  
  var bomb = createSection(hud, 'Бомба');
  createYesNoDropDown(bomb, "Показывать таймер взрыва бомбы и точку", 'hud', 'bomb_timer');
  separator(bomb);
  createYesNoDropDown(bomb, "Показывать таймер обезвреживания бомбы", 'hud', 'defusing_alert');
  separator(bomb);
  createYesNoDropDown(bomb, "Показывать предупреждение об установке бомбы", 'hud', 'bomb_plant_alert');

  var killfeed = createSection(hud, 'Лента убийств');
  separator(killfeed);
  createYesNoDropDown(killfeed, "Сохранять мою ленту убийств в течение раунда", 'hud', 'preserve_killfeed');

  var time = createSection(hud, 'Время');
  separator(time);
  createYesNoDropDown(time, "Показывать таймер после раунда", 'hud', 'postround_timer');

  var visuals = createVisualsTab();

  var playerInfoTab = createSubTab(visuals, 'player_info');

  var playerInfo = createSection(playerInfoTab, 'Инфо об игроках в мире');
  createDropDown(playerInfo, "Главный переключатель", 'visuals', 'player_information_through_walls', ['Враги', 'Все игроки', 'Выкл']);

  var playerPosition = createSection(playerInfoTab, 'Позиция игрока');
  createYesNoDropDown(playerPosition, "Показывать стрелку позиции игрока", 'visuals', 'player_info_position');
  separator(playerPosition);
  createDropDown(playerPosition, "Цвет стрелки позиции игрока", 'visuals', 'player_info_position_color', ['Цвет игрока / команды', 'Цвет команды']);

  var playerHealth = createSection(playerInfoTab, 'Здоровье игрока');
  createYesNoDropDown(playerHealth, "Показывать здоровье игрока", 'visuals', 'player_info_health');
  separator(playerHealth);
  createDropDown(playerHealth, "Цвет текста здоровья игрока", 'visuals', 'player_info_health_color', ['По уровню здоровья', 'Белый']);

  var playerWeapon = createSection(playerInfoTab, 'Оружие игрока');
  createYesNoDropDown(playerWeapon, "Показывать иконку активного оружия игрока", 'visuals', 'player_info_weapon');
  separator(playerWeapon);
  createYesNoDropDown(playerWeapon, "Показывать боезапас активного оружия игрока", 'visuals', 'player_info_weapon_clip');
  separator(playerWeapon);
  createYesNoDropDown(playerWeapon, 'Показывать иконку носителя бомбы', 'visuals', 'player_info_bomb_carrier');
  separator(playerWeapon);
  createYesNoDropDown(playerWeapon, 'Показывать иконку установки бомбы', 'visuals', 'player_info_bomb_planting');

  var playerIcons = createSection(playerInfoTab, 'Иконки');
  createYesNoDropDown(playerIcons, "Показывать иконку обезвреживания", 'visuals', 'player_info_defuse');
  separator(playerIcons);
  createYesNoDropDown(playerIcons, 'Показывать иконку поднятия заложника', 'visuals', 'player_info_hostage_pickup');
  separator(playerIcons);
  createYesNoDropDown(playerIcons, 'Показывать иконку спасения заложника', 'visuals', 'player_info_hostage_rescue');
  separator(playerIcons);
  createYesNoDropDown(playerIcons, 'Показывать иконку ослепления флешкой', 'visuals', 'player_info_blinded');

  var outlineGlowTab = createSubTab(visuals, 'outline_glow');

  var outlineGlow = createSection(outlineGlowTab, 'Контурное свечение');
  createOnOffDropDown(outlineGlow, "Главный переключатель", 'visuals', 'outline_glow_enable');

  var playerOutlineGlow = createSection(outlineGlowTab, 'Игроки');
  createDropDown(playerOutlineGlow, "Подсвечивать игроков", 'visuals', 'player_outline_glow', ['Враги', 'Все игроки', 'Выкл']);
  separator(playerOutlineGlow);
  createDropDown(playerOutlineGlow, "Цвет свечения игроков", 'visuals', 'player_outline_glow_color', ['Цвет игрока / команды', 'Цвет команды', 'По уровню здоровья', 'Враг / союзник']);
  separator(playerOutlineGlow);
  separator(playerOutlineGlow);
  createHueSlider(playerOutlineGlow, "Оттенок синего игрока", 'player_outline_glow_blue_hue', 191, 240);
  separator(playerOutlineGlow);
  createHueSlider(playerOutlineGlow, "Оттенок зелёного игрока", 'player_outline_glow_green_hue', 110, 140);
  separator(playerOutlineGlow);
  createHueSlider(playerOutlineGlow, "Оттенок жёлтого игрока", 'player_outline_glow_yellow_hue', 47, 60);
  separator(playerOutlineGlow);
  createHueSlider(playerOutlineGlow, "Оттенок оранжевого игрока", 'player_outline_glow_orange_hue', 11, 20);
  separator(playerOutlineGlow);
  createHueSlider(playerOutlineGlow, "Оттенок фиолетового игрока", 'player_outline_glow_purple_hue', 250, 280);
  separator(playerOutlineGlow);
  separator(playerOutlineGlow);
  createHueSlider(playerOutlineGlow, "Оттенок команды T", 'player_outline_glow_t_hue', 30, 40);
  separator(playerOutlineGlow);
  createHueSlider(playerOutlineGlow, "Оттенок команды CT", 'player_outline_glow_ct_hue', 210, 230);
  separator(playerOutlineGlow);
  separator(playerOutlineGlow);
  createHueSlider(playerOutlineGlow, "Оттенок высокого здоровья", 'player_outline_glow_high_hp_hue', 0, 359);
  separator(playerOutlineGlow);
  createHueSlider(playerOutlineGlow, "Оттенок низкого здоровья", 'player_outline_glow_low_hp_hue', 0, 359);
  separator(playerOutlineGlow);
  separator(playerOutlineGlow);
  createHueSlider(playerOutlineGlow, "Оттенок врага", 'player_outline_glow_enemy_hue', 0, 359);
  separator(playerOutlineGlow);
  createHueSlider(playerOutlineGlow, "Оттенок союзника", 'player_outline_glow_ally_hue', 0, 359);

  var weaponOutlineGlow = createSection(outlineGlowTab, 'Оружие');
  createYesNoDropDown(weaponOutlineGlow, "Подсвечивать оружие рядом на земле", 'visuals', 'weapon_outline_glow');
  separator(weaponOutlineGlow);
  createYesNoDropDown(weaponOutlineGlow, "Подсвечивать летящие гранаты", 'visuals', 'grenade_proj_outline_glow');
  separator(weaponOutlineGlow);
  separator(weaponOutlineGlow);
  createHueSlider(weaponOutlineGlow, "Оттенок флешки", 'outline_glow_flashbang_hue', 191, 250);
  separator(weaponOutlineGlow);
  createHueSlider(weaponOutlineGlow, "Оттенок HE-гранаты", 'outline_glow_hegrenade_hue', 300, 359);
  separator(weaponOutlineGlow);
  createHueSlider(weaponOutlineGlow, "Оттенок дымовой гранаты", 'outline_glow_smoke_hue', 110, 140);
  separator(weaponOutlineGlow);
  createHueSlider(weaponOutlineGlow, "Оттенок молотова / зажигательной гранаты", 'outline_glow_molotov_hue', 20, 60);

  var bombAndDefuseKitOutlineGlow = createSection(outlineGlowTab, 'Бомба и набор сапёра');
  createYesNoDropDown(bombAndDefuseKitOutlineGlow, "Подсвечивать выброшенную бомбу", 'visuals', 'dropped_bomb_outline_glow');
  separator(bombAndDefuseKitOutlineGlow);
  createYesNoDropDown(bombAndDefuseKitOutlineGlow, "Подсвечивать установленную бомбу", 'visuals', 'ticking_bomb_outline_glow');
  separator(bombAndDefuseKitOutlineGlow);
  createYesNoDropDown(bombAndDefuseKitOutlineGlow, "Подсвечивать наборы сапёра рядом на земле", 'visuals', 'defuse_kit_outline_glow');
  separator(bombAndDefuseKitOutlineGlow);
  separator(bombAndDefuseKitOutlineGlow);
  createHueSlider(bombAndDefuseKitOutlineGlow, "Оттенок выброшенной бомбы", 'outline_glow_dropped_bomb_hue', 0, 359);
  separator(bombAndDefuseKitOutlineGlow);
  createHueSlider(bombAndDefuseKitOutlineGlow, "Оттенок установленной бомбы", 'outline_glow_ticking_bomb_hue', 0, 359);
  separator(bombAndDefuseKitOutlineGlow);
  createHueSlider(bombAndDefuseKitOutlineGlow, "Оттенок набора сапёра", 'outline_glow_defuse_kit_hue', 0, 359);

  var hostageOutlineGlow = createSection(outlineGlowTab, 'Заложники');
  createYesNoDropDown(hostageOutlineGlow, "Подсвечивать заложников", 'visuals', 'hostage_outline_glow');
  separator(hostageOutlineGlow);
  createHueSlider(hostageOutlineGlow, "Оттенок заложника", 'outline_glow_hostage_hue', 0, 359);

  var _modelGlowTab = createSubTab(visuals, 'model_glow');
  _modelGlowTab.style.overflow = 'squish squish';
  _modelGlowTab.style.flowChildren = 'right';

  var modelGlowPreview = $.CreatePanel('Panel', _modelGlowTab, '', { style: 'flow-children: down;' });
  $.CreatePanel('Label', modelGlowPreview, '', { style: 'vertical-align: top; horizontal-align: center; font-size: 40;', text: 'Предпросмотр' });
  var playerModelGlowPreview = $.CreatePanel('Panel', modelGlowPreview, '', { style: 'flow-children: right; margin-top: 20px;' });
  createPlayerModelGlowPreview(playerModelGlowPreview, 'ModelGlowPreviewPlayerTT', 'ModelGlowPreviewPlayerTTLabel', 'characters/models/tm_professional/tm_professional_varf.vmdl', makeFauxItemId(7, 921));
  createPlayerModelGlowPreview(playerModelGlowPreview, 'ModelGlowPreviewPlayerCT', 'ModelGlowPreviewPlayerCTLabel', 'characters/models/ctm_st6/ctm_st6_variante.vmdl', makeFauxItemId(9, 819));

  $.CreatePanel('Label', modelGlowPreview, '', { style: 'horizontal-align: center; margin-top: 20px;', text: 'Оружие на земле' });

  var weaponModelGlowPreview = $.CreatePanel('Panel', modelGlowPreview, '', { style: 'flow-children: right;' });

  var modelGlowPreviewWeapon = $.CreatePanel('MapItemPreviewPanel', weaponModelGlowPreview, 'ModelGlowPreviewWeapon', {
    map: "ui/xpshop_item",
    camera: "camera_weapon_0",
    "require-composition-layer": true,
    player: false,
    initial_entity: "item",
    mouse_rotate: false,
    sync_spawn_addons: true,
    "transparent-background": true,
    "pin-fov": "vertical",
    style: "width: 400px; height: 160px;"
  });
  modelGlowPreviewWeapon.SetItemItemId(makeFauxItemId(16, 255), {});

  var grenadeModelGlowPreview = $.CreatePanel('Panel', weaponModelGlowPreview, '', { style: 'flow-children: down;' });

  var grenadeModelGlowPreviewRow1 = $.CreatePanel('Panel', grenadeModelGlowPreview, '', { style: 'flow-children: right;' });
  createGrenadeModelGlowPreview(grenadeModelGlowPreviewRow1, 'ModelGlowPreviewFlashbang', 43);
  createGrenadeModelGlowPreview(grenadeModelGlowPreviewRow1, 'ModelGlowPreviewHEGrenade', 44);

  var grenadeModelGlowPreviewRow2 = $.CreatePanel('Panel', grenadeModelGlowPreview, '', { style: 'flow-children: right;' });
  createGrenadeModelGlowPreview(grenadeModelGlowPreviewRow2, 'ModelGlowPreviewSmoke', 45);
  createGrenadeModelGlowPreview(grenadeModelGlowPreviewRow2, 'ModelGlowPreviewIncendiary', 48);

  var modelGlowTab = $.CreatePanel('Panel', _modelGlowTab, '', { style: 'flow-children: down; margin-right: 40px; overflow: squish scroll;' });

  var modelGlow = createSection(modelGlowTab, 'Свечение моделей');
  createOnOffDropDown(modelGlow, "Главный переключатель", 'visuals', 'model_glow_enable');

  var playerModelGlow = createSection(modelGlowTab, 'Игроки');
  createDropDown(playerModelGlow, "Подсвечивать модели игроков", 'visuals', 'player_model_glow', ['Враги', 'Все игроки', 'Выкл']);
  separator(playerModelGlow);
  createDropDown(playerModelGlow, "Режим цвета свечения модели игрока", 'visuals', 'player_model_glow_color', ['Цвет игрока / команды', 'Цвет команды', 'По уровню здоровья', 'Враг / союзник']);
  separator(playerModelGlow);
  separator(playerModelGlow);
  createHueSlider(playerModelGlow, "Оттенок синего игрока", 'player_model_glow_blue_hue', 191, 240);
  separator(playerModelGlow);
  createHueSlider(playerModelGlow, "Оттенок зелёного игрока", 'player_model_glow_green_hue', 110, 140);
  separator(playerModelGlow);
  createHueSlider(playerModelGlow, "Оттенок жёлтого игрока", 'player_model_glow_yellow_hue', 47, 60);
  separator(playerModelGlow);
  createHueSlider(playerModelGlow, "Оттенок оранжевого игрока", 'player_model_glow_orange_hue', 11, 20);
  separator(playerModelGlow);
  createHueSlider(playerModelGlow, "Оттенок фиолетового игрока", 'player_model_glow_purple_hue', 250, 280);
  separator(playerModelGlow);
  separator(playerModelGlow);
  createHueSlider(playerModelGlow, "Оттенок команды T", 'player_model_glow_t_hue', 30, 40);
  separator(playerModelGlow);
  createHueSlider(playerModelGlow, "Оттенок команды CT", 'player_model_glow_ct_hue', 210, 230);
  separator(playerModelGlow);
  separator(playerModelGlow);
  createHueSlider(playerModelGlow, "Оттенок высокого здоровья", 'player_model_glow_high_hp_hue', 0, 359);
  separator(playerModelGlow);
  createHueSlider(playerModelGlow, "Оттенок низкого здоровья", 'player_model_glow_low_hp_hue', 0, 359);
  separator(playerModelGlow);
  separator(playerModelGlow);
  createHueSlider(playerModelGlow, "Оттенок врага", 'player_model_glow_enemy_hue', 0, 359);
  separator(playerModelGlow);
  createHueSlider(playerModelGlow, "Оттенок союзника", 'player_model_glow_ally_hue', 0, 359);
)"
// split the string literal because MSVC does not support string literals longer than 16k chars - error C2026
u8R"(
  var weaponModelGlow = createSection(modelGlowTab, 'Оружие');
  createYesNoDropDown(weaponModelGlow, "Подсвечивать модели оружия на земле", 'visuals', 'weapon_model_glow');
  separator(weaponModelGlow);
  createYesNoDropDown(weaponModelGlow, "Подсвечивать модели летящих гранат", 'visuals', 'grenade_proj_model_glow');
  separator(weaponModelGlow);
  separator(weaponModelGlow);
  createHueSlider(weaponModelGlow, "Оттенок флешки", 'model_glow_flashbang_hue', 191, 250);
  separator(weaponModelGlow);
  createHueSlider(weaponModelGlow, "Оттенок HE-гранаты", 'model_glow_hegrenade_hue', 300, 359);
  separator(weaponModelGlow);
  createHueSlider(weaponModelGlow, "Оттенок дымовой гранаты", 'model_glow_smoke_hue', 110, 140);
  separator(weaponModelGlow);
  createHueSlider(weaponModelGlow, "Оттенок молотова / зажигательной гранаты", 'model_glow_molotov_hue', 20, 60);

  var bombModelGlow = createSection(modelGlowTab, 'Бомба и набор сапёра');
  createYesNoDropDown(bombModelGlow, "Подсвечивать модель выброшенной бомбы", 'visuals', 'dropped_bomb_model_glow');
  separator(bombModelGlow);
  createYesNoDropDown(bombModelGlow, "Подсвечивать модель установленной бомбы", 'visuals', 'ticking_bomb_model_glow');
  separator(bombModelGlow);
  createYesNoDropDown(bombModelGlow, "Подсвечивать модели наборов сапёра на земле", 'visuals', 'defuse_kit_model_glow');
  separator(bombModelGlow);
  separator(bombModelGlow);
  createHueSlider(bombModelGlow, "Оттенок выброшенной бомбы", 'model_glow_dropped_bomb_hue', 0, 359);
  separator(bombModelGlow);
  createHueSlider(bombModelGlow, "Оттенок установленной бомбы", 'model_glow_ticking_bomb_hue', 0, 359);
  separator(bombModelGlow);
  createHueSlider(bombModelGlow, "Оттенок набора сапёра", 'model_glow_defuse_kit_hue', 0, 359);

  var _viewmodelTab = createSubTab(visuals, 'viewmodel');
  _viewmodelTab.style.overflow = 'squish squish';
  _viewmodelTab.style.flowChildren = 'right';

  var viewmodelPreviewContainer = $.CreatePanel('Panel', _viewmodelTab, '', { style: 'flow-children: down;' });
  $.CreatePanel('Label', viewmodelPreviewContainer, '', { style: 'vertical-align: top; horizontal-align: center; font-size: 40;', text: 'Предпросмотр' });

  var viewmodelPreview = $.CreatePanel('MapItemPreviewPanel', viewmodelPreviewContainer, 'ViewmodelPreview', {
    map: "ui/xpshop_item",
    camera: "camera_weapon_0",
    "require-composition-layer": true,
    player: false,
    initial_entity: "item",
    mouse_rotate: false,
    sync_spawn_addons: true,
    "transparent-background": true,
    "pin-fov": "vertical",
    style: "width: 700px; height: 400px;"
  });
  viewmodelPreview.SetHideStaticGeometry(true);

  var viewmodelTab = $.CreatePanel('Panel', _viewmodelTab, '', { style: 'flow-children: down; margin-right: 40px; overflow: squish scroll;' });

  var viewmodelModification = createSection(viewmodelTab, 'Изменение модели от первого лица');
  createOnOffDropDown(viewmodelModification, "Главный переключатель", 'visuals', 'viewmodel_mod');

  var viewmodelFov = createSection(viewmodelTab, 'FOV модели от первого лица');
  createYesNoDropDown(viewmodelFov, "Изменять FOV модели от первого лица", 'visuals', 'viewmodel_fov_mod');
  separator(viewmodelFov);
  createSlider(viewmodelFov, "Fov", 'viewmodel_fov', 40, 90);

  $.Osiris.navigateToSubTab('visuals', 'player_info');

  var sound = createTab('sound');
  
  var playerSoundVisualization = createSection(sound, 'Визуализация звуков игроков');
  separator(playerSoundVisualization);
  createYesNoDropDown(playerSoundVisualization, "Визуализировать звук шагов игрока", 'sound', 'visualize_player_footsteps');

  var bombSoundVisualization = createSection(sound, 'Визуализация звуков бомбы');
  createYesNoDropDown(bombSoundVisualization, "Визуализировать звук установки бомбы", 'sound', 'visualize_bomb_plant');
  separator(bombSoundVisualization);
  createYesNoDropDown(bombSoundVisualization, "Визуализировать звуковой сигнал бомбы", 'sound', 'visualize_bomb_beep');
  separator(bombSoundVisualization);
  createYesNoDropDown(bombSoundVisualization, "Визуализировать звук обезвреживания бомбы", 'sound', 'visualize_bomb_defuse');

  var weaponSoundVisualization = createSection(sound, 'Визуализация звуков оружия');
  createYesNoDropDown(weaponSoundVisualization, "Визуализировать звук прицеливания", 'sound', 'visualize_scope_sound');
  separator(weaponSoundVisualization);
  createYesNoDropDown(weaponSoundVisualization, "Визуализировать звук перезарядки", 'sound', 'visualize_reload_sound');

  $.Osiris.navigateToTab('hud');
})();
)"




