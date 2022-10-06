import { iGroup, iGroupMember } from './group';
export default interface iTreeRoot extends iGroup {
  members?: iGroupMember[];
  children?: iTreeRoot[];
}
