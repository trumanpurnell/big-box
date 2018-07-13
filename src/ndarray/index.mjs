import * as matrix from '../math/matrix'
import Header from './header'
import * as utils from '../utils'

export default class MultiDimArray {

    constructor() {}

    _c1(A, type = Float64Array) {
        this.data = new type(utils.flatten(A))
        this.header = new Header({
            shape: utils.getShape(A)
        })

        return this
    }

    _c2(data, header) {
        this.data = data
        this.header = header

        return this
    }

    static array(A, type = Float64Array) {
        return new MultiDimArray()._c1(A, type)
    }

    static arange(...args) {
        return new MultiDimArray()._c1(utils.helperArange(args))
    }


    slice(...indices) {
        const newHeader = utils.getSliceHeader(indices, this)

        if (newHeader.shape.length)
            return new MultiDimArray()._c2(this.data, newHeader)
        else
            return this.data[newHeader.offset]
    }

    reshape(...shape) {
        if (!this.header.contig) // if the array is not contigous, a reshape means data copy
            return new MultiDimArray()._c1(utils.getDataForHeader(this))

        const newHeader = utils.getReshapeHeader(shape, this)
        return new MultiDimArray()._c2(this.data, newHeader)
    }

    dot(A) {
        return new MultiDimArray()._c2(...matrix.mutliply(this, A))
    }

    inspect() {
        return this.toString()
    }

    toString() {
        return utils.helperToString(this) + '\n'
    }
}