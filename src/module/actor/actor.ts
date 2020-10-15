export class RisusActor extends Actor {
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
