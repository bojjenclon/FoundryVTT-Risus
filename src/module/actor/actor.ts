export class RisusActor<T, I extends Item<{}>> extends Actor<T, I> {
  static async create(data, options = {}) {
    mergeObject(data, {
      data: {
        pump: {
          value: game.settings.get('risus', 'defaultPump')
        }
      }
    });

    return super.create(data, options);
  }
}
