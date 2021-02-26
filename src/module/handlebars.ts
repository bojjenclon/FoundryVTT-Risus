export const registerHandlebars = () => {
  Handlebars.registerHelper('repeat', (times, block) => {
    const out = [];
    const data = {
      index: 0
    };

    for (let i = 0; i < times; i++) {
      data.index = i;

      out.push(
        block.fn(this, {
          data
        })
      );
    }

    return out.join('');
  });

  Handlebars.registerHelper('withSign', val => {
    const sign = val > 0 ? '+' : '';
    return `${sign}${val}`;
  });

  Handlebars.registerHelper('concat', (v1, v2) => `${v1}${v2}`);

  Handlebars.registerHelper('add', (lhs, rhs) => {
    return parseInt(lhs) + rhs;
  });

  Handlebars.registerHelper('lt', (lhs, rhs) => {
    return lhs < rhs;
  });

  Handlebars.registerHelper('lte', (lhs, rhs) => {
    return lhs <= rhs;
  });

  Handlebars.registerHelper('ge', (lhs, rhs) => {
    return lhs > rhs;
  });

  Handlebars.registerHelper('gte', (lhs, rhs) => {
    return lhs >= rhs;
  });

  Handlebars.registerHelper('clicheName', (cliche: Entity) => {
    if (cliche.getFlag('risus', 'modified')) {
      return cliche.getFlag('risus', 'name');
    }

    return cliche.name;
  });

  Handlebars.registerHelper('clicheDice', (cliche: Entity) => {
    if (cliche.getFlag('risus', 'modified')) {
      return cliche.getFlag('risus', 'dice');
    }

    return cliche.data.data['dice'];
  });

  Handlebars.registerHelper('clicheModified', (cliche: Entity) => {
    return cliche.getFlag('risus', 'modified');
  });

  Handlebars.registerHelper('gearName', (gear: Entity) => {
    if (gear.getFlag('risus', 'modified')) {
      return gear.getFlag('risus', 'name');
    }

    return gear.name;
  });

  Handlebars.registerHelper('gearQuantity', (gear: Entity) => {
    if (gear.getFlag('risus', 'modified')) {
      return gear.getFlag('risus', 'quantity');
    }

    return gear.data.data['quantity'];
  });

  Handlebars.registerHelper('gearModified', (gear: Entity) => {
    return gear.getFlag('risus', 'modified');
  });
}
