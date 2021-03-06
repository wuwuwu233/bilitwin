/*
 * Copyright (C) 2018 Qli5. All Rights Reserved.
 *
 * @author qli5 <goodlq11[at](163|gmail).com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import CommonCacheDB from './lib-cache-db/common-cache-db.js';
import BaseMutableCacheDB from './lib-cache-db/base-mutable-cache-db.js';
import IDBCacheDB from './lib-cache-db/idb-cache-db.js';
import ChromeCacheDB from './lib-cache-db/chrome-cache-db.js';
export { CommonCacheDB, BaseMutableCacheDB };
export { IDBCacheDB, ChromeCacheDB };
export default { IDBCacheDB, ChromeCacheDB };
//# sourceMappingURL=cache-db.js.map