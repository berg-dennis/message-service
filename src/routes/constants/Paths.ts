/**
 * Express router paths
 */

import { Immutable } from '@src/other/types';

const Paths = {
  Base: '/api',
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Messages: {
    Base: '/messages',
    Get: '/all',
    Add: '/submit',
    Latest: '/latest/',
    FetchOrdered: '/ordered/byindex',
    Delete: '/delete/',
    DeleteOne: '/delete/:id',
  },
};
// Export as readonly to ensure consistency
export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;
