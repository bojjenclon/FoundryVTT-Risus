export interface CharacterSheetData extends ActorSheet.Data {
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
    clicheTab.find('input').on('change', async (evt) => {
      evt.stopPropagation();
      evt.preventDefault();

      const elRow = evt.currentTarget.closest('.cliche') as HTMLElement;
      const $row = $(elRow);
      const clicheId = elRow.dataset.clicheId;

      const clicheNameInput = $row.find('input[name="clicheName"]');
      const clicheDiceInput = $row.find('input[name="clicheDice"]');

      const cliche = this.actor.getOwnedItem(clicheId);

      const oldName = cliche.name;
      const oldDice = parseInt(cliche.data.data['dice'], 10);

      const newName = clicheNameInput.val();
      const newDice = parseInt(String(clicheDiceInput.val()), 10);

      let doModify = true;

      if (cliche.getFlag('risus', 'modified')) {
        if (newName === oldName && newDice === oldDice) {
          doModify = false;

          await cliche.unsetFlag('risus', 'name');
          await cliche.unsetFlag('risus', 'dice');
          await cliche.unsetFlag('risus', 'modified');
        }
      }

      if (doModify) {
        await cliche.setFlag('risus', 'name', newName);
        await cliche.setFlag('risus', 'dice', newDice);
        await cliche.setFlag('risus', 'modified', true);
      }
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

      const numDice = cliche.data.data['dice'];
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

      await cliche.unsetFlag('risus', 'name');
      await cliche.unsetFlag('risus', 'dice');
      await cliche.unsetFlag('risus', 'modified');

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
    gearTab.find('input').on('change', async (evt) => {
      evt.stopPropagation();
      evt.preventDefault();

      const elRow = evt.currentTarget.closest('.gear') as HTMLElement;
      const $row = $(elRow);
      const gearId = elRow.dataset.gearId;

      const gearNameInput = $row.find('input[name="gearName"]');
      const gearQuantityInput = $row.find('input[name="gearQuantity"]');

      const gear = this.actor.getOwnedItem(gearId);

      const oldName = gear.name;
      const oldQuantity = parseInt(gear.data.data['quantity'], 10);

      const newName = gearNameInput.val();
      const newQuantity = parseInt(String(gearQuantityInput.val()), 10);

      let doModify = true;

      if (gear.getFlag('risus', 'modified')) {
        if (newName === oldName && newQuantity === oldQuantity) {
          doModify = false;

          await gear.unsetFlag('risus', 'name');
          await gear.unsetFlag('risus', 'quantity');
          await gear.unsetFlag('risus', 'modified');
        }
      }

      if (doModify) {
        await gear.setFlag('risus', 'name', newName);
        await gear.setFlag('risus', 'quantity', newQuantity);
        await gear.setFlag('risus', 'modified', true);
      }
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

      await gear.unsetFlag('risus', 'name');
      await gear.unsetFlag('risus', 'quantity');
      await gear.unsetFlag('risus', 'modified');

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

  async close(): Promise<void> {
    await super.close();

    const allCliches = this.actor.itemTypes['cliche'];
    for (let i = 0; i < allCliches.length; i++) {
      const cliche = allCliches[i];

      if (cliche.getFlag('risus', 'modified')) {
        await cliche.unsetFlag('risus', 'name');
        await cliche.unsetFlag('risus', 'dice');
        await cliche.unsetFlag('risus', 'modified');
      }
    }

    const allGear = this.actor.itemTypes['gear'];
    for (let i = 0; i < allGear.length; i++) {
      const gear = allGear[i];

      if (gear.getFlag('risus', 'modified')) {
        await gear.unsetFlag('risus', 'name');
        await gear.unsetFlag('risus', 'quanitity');
        await gear.unsetFlag('risus', 'modified');
      }
    }
  }
}
