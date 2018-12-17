import test from 'ava'

import * as R from 'ramda'

import Side from '../lib/internal/depth.side'
import Depth, { Bids, Asks } from '../lib/depth'

const xs = [
  [ 50, 1 ],
  [ 70, 1 ],
  [ 60, 1 ]
]

const xsNext = [
  [ 70, 2 ],
  [ 75, 3 ],
  [ 50, 0 ]
]

test.todo('constructor')
