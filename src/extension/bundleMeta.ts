import { get as nodecg } from './util/nodecg'
import { repBundleVersion } from './util/replicants'

nodecg().log.trace('Extension bundleMeta loaded.')

repBundleVersion.value = nodecg().bundleVersion
