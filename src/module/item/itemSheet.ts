export class RisusItemSheet extends ItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["risus", "sheet", "item"],
      width: 300,
      height: 200
    });
  }

  showEditor: boolean = false;
  editingAbilityIdx: number = -1;
  editingAbilityText: string;

  get template() {
    const path = "systems/risus/templates/item";
    return `${path}/${this.item.data.type}-sheet.html`;
  }

  getData() {
    const data = super.getData();

    const { type } = this.item.data;
    switch (type) {
    }

    return data;
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html);

    const { type } = this.item.data;

    const window = html.closest('.window-app');
    window.addClass(type);

    switch (type) {
    }
  }
}
