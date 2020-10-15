export interface CharacterSheetData extends ActorSheetData {
  showPump: Boolean;

  cliches: Array<Object>;
  gear: Array<Object>;
}

export class RisusCharacterSheet extends ActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['risus', 'sheet', 'actor'],
      width: 600,
      height: 500,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".tab-body",
        initial: "bio"
      }]
    });
  }

  get template() {
    const { type } = this.actor.data;
    return `systems/risus/templates/actor/${type}-sheet.html`;
  }

  getData(): CharacterSheetData {
    const data = super.getData() as CharacterSheetData;

    const { actor } = this;

    data.showPump = game.settings.get('risus', 'showPump');

    data.cliches = actor.itemTypes['cliche'] || [];
    data.gear = actor.itemTypes['gear'] || [];

    return data;
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html);

    const { type } = this.actor.data;

    const window = html.closest('.window-app');
    window.addClass(type);

    // Cliche listeners
    const clicheTab = html.find('.tab.cliche');

    // Prevent the default behavior as it will refresh the form
    // before the user can save their changes.
    clicheTab.find('input').on('change', evt => {
      evt.stopPropagation();
      evt.preventDefault();
    });

    clicheTab.find('.add-cliche').on('click', async (evt) => {
      const { actor } = this;

      await actor.createOwnedItem({
        name: 'New Cliche',
        type: 'cliche',
        data: {}
      }, { renderSheet: false });
    });

    clicheTab.find('.roll-cliche').on('click', async (evt) => {
      evt.preventDefault();

      const { actor } = this;
      let el = evt.currentTarget;
      let clicheId = el.dataset.clicheId;
      while (!clicheId) {
        el = el.parentElement;
        clicheId = el.dataset.clicheId;
      }
      const cliche = await actor.getOwnedItem(clicheId);

      const numDice = cliche.data.data.dice;
      const roll = new Roll(`${numDice}d6`);

      roll.toMessage({
        title: game.i18n.localize('risus.roll.cliche.title'),
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: game.i18n.localize('risus.roll.cliche.flavor')
          .replace('##ACTOR##', actor.name)
          .replace('##CLICHE##', cliche.name)
      });
    });

    clicheTab.find('.save-cliche').on('click', async (evt) => {
      evt.preventDefault();

      const { actor } = this;
      let el = evt.currentTarget;
      let clicheId = el.dataset.clicheId;
      while (!clicheId) {
        el = el.parentElement;
        clicheId = el.dataset.clicheId;
      }
      const cliche = await actor.getOwnedItem(clicheId);

      const updatedName = clicheTab.find('input[name="clicheName"]').val();
      const updatedDice = clicheTab.find('input[name="clicheDice"]').val();

      await cliche.update({
        name: updatedName,
        'data.dice': updatedDice
      });
    });

    clicheTab.find('.delete-cliche').on('click', async (evt) => {
      evt.preventDefault();

      const { actor } = this;
      let el = evt.currentTarget;
      let clicheId = el.dataset.clicheId;
      while (!clicheId) {
        el = el.parentElement;
        clicheId = el.dataset.clicheId;
      }

      await actor.deleteOwnedItem(clicheId);
    });

    // Gear listeners
    const gearTab = html.find('.tab.gear');

    // Prevent the default behavior as it will refresh the form
    // before the user can save their changes.
    gearTab.find('input').on('change', evt => {
      evt.stopPropagation();
      evt.preventDefault();
    });

    gearTab.find('.add-gear').on('click', async (evt) => {
      const { actor } = this;

      await actor.createOwnedItem({
        name: 'New Gear',
        type: 'gear',
        data: {}
      }, { renderSheet: false });
    });

    gearTab.find('.save-gear').on('click', async (evt) => {
      evt.preventDefault();

      const { actor } = this;
      let el = evt.currentTarget;
      let gearId = el.dataset.gearId;
      while (!gearId) {
        el = el.parentElement;
        gearId = el.dataset.gearId;
      }
      const gear = await actor.getOwnedItem(gearId);

      const updatedName = gearTab.find('input[name="gearName"]').val();
      const updatedQuantity = gearTab.find('input[name="gearQuantity"]').val();

      await gear.update({
        name: updatedName,
        'data.quantity': updatedQuantity
      });
    });

    gearTab.find('.edit-gear').on('click', async (evt) => {
      evt.preventDefault();

      const { actor } = this;
      let el = evt.currentTarget;
      let gearId = el.dataset.gearId;
      while (!gearId) {
        el = el.parentElement;
        gearId = el.dataset.gearId;
      }

      const gear = await actor.getOwnedItem(gearId);
      if (gear) {
        gear.sheet.render(true);
      }
    });

    gearTab.find('.delete-gear').on('click', async (evt) => {
      evt.preventDefault();

      const { actor } = this;
      let el = evt.currentTarget;
      let gearId = el.dataset.gearId;
      while (!gearId) {
        el = el.parentElement;
        gearId = el.dataset.gearId;
      }

      await actor.deleteOwnedItem(gearId);
    });
  }
}
