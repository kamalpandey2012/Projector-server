import Position from './Position';

export default class EditResponse {
  constructor(mode = 0, position1, position2, text) {
    this.mode = mode;
    this.position1 = new Position(position1.line, position1.character);
    this.position2 = new Position(position2.line, position2.character);
    this.text = text;
  }
}