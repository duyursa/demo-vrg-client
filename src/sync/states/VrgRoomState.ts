import { Schema, type, MapSchema } from '@colyseus/schema';
import { Entity } from './Entity';
import { Visitor, VisitorState } from './Visitor';
import { Client } from '@mirabo-tech/colyseus_core';
import { Attribute } from './Attribute';
import { getLogger } from '../../utils/logger';

export class VRGRoomState extends Schema {
  private readonly logger = getLogger(VRGRoomState.name);

  @type('number')
  id: number;

  @type('string')
  name?: string;

  @type('string')
  password?: string;

  @type({ map: Visitor })
  visitors = new MapSchema<Visitor>();

  @type({ map: Entity })
  entities = new MapSchema<Entity>();

  createVisitor(
    sessionId: string,
    state: VisitorState, 
    userId: number, 
    name: string, 
  ): Visitor {
    const FUNC_NAME = 'createVisitor';
    this.logger.info(FUNC_NAME, { sessionId, state, name });
    const visitor = new Visitor().assign({
      sessionId: sessionId,
      state: state,
      userId: userId,
      name: name,
    });
    this.visitors.set(sessionId, visitor);
    return visitor;
  }

  setVisitorUserData(sessionId: string, userData: string): Visitor {
    const FUNC_NAME = 'setVisitorUserData';
    this.logger.info(FUNC_NAME, { sessionId, userData });
    const visitor = this.visitors.get(sessionId);
    if (!visitor) {
      throw `not found visitor with sessionId ${sessionId}`;
    }
    visitor.userData = userData;
    this.visitors.set(sessionId, visitor);
    return visitor;
  }

  removeVisitor(client: Client) {
    const FUNC_NAME = 'removeVisitor';
    this.logger.info(FUNC_NAME, client.sessionId);
    this.visitors.delete(client.sessionId);
  }

  countVisitor() {
    return this.visitors.size;
  }

  /**
   *
   * @param id
   * @param type
   * @param attributes <field, {dataType, dataValue}>
   */
  createEntity(id: string, type: string, attributes: object) {
    const FUNC_NAME = 'createEntity';
    if (this.entities.has(id)) {
      this.logger.warn(FUNC_NAME, 'already exist entity with id', id);
      throw `already exist entity with id ${id}`;
    }
    this.logger.info(FUNC_NAME, { id, type });
    const entity = new Entity().assign({ id, type });
    for (const [field, data] of Object.entries(attributes)) {
      const attribute = new Attribute().assign({
        dataType: data['dataType'],
        dataValue: data['dataValue'],
      });
      entity.attributes.set(field, attribute);
    }
    this.entities.set(id, entity);
  }

  updateEntity(id: string, attributes: object) {
    const FUNC_NAME = 'updateEntity';
    this.logger.info(FUNC_NAME, { id, type });
    if (!this.entities.has(id)) {
      this.logger.warn(FUNC_NAME, 'not found entity with Id', id);
      throw `not found entity with Id ${id}`;
    }
    const entity = this.entities.get(id);
    for (const [field, data] of Object.entries(attributes)) {
      const attribute = new Attribute().assign({
        dataType: data['dataType'],
        dataValue: data['dataValue'],
      });
      entity.attributes.set(field, attribute);
    }
  }

  deleteEntity(id: string) {
    const FUNC_NAME = 'deleteEntity';
    this.logger.info(FUNC_NAME, { id });
    if (!this.entities.has(id)) {
      this.logger.warn(FUNC_NAME, 'not found entity with id', id);
      throw `not found entity with id ${id}`;
    }
    this.entities.delete(id);
  }
}
