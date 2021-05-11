export default {
    props: {
        type: {
            type: String
        },
        autoOpen: {
            type: Boolean,
            default() {
                return false;
            }
        },
        initParam: {
            type: Object,
            default() {
                return undefined
            }

        }
    },
    data() {
        return {
            connected: false,
        }
    },
    methods: {
        init() {
        },
        //需要实现
        inputData(data) {
            console.debug("input ", data)
        },
        close() {
            this.connected = false
        },
        open() {
            this.connected = true
        },
        __output(data) {
            console.debug("output ", data)
            this.$emit("output", data)
        }
    },
    created() {
        console.log("created",this.initParam)
        if (this.initParam) {
            if (this.init) {
                if (this.init(Object.assign({}, this.initParam))) {
                    if (this.autoOpen) {
                        this.open()
                    }
                }
            }
        }
    },
    destroyed() {
        this.close()
    }

}
