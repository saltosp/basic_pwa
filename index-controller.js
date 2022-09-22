var basic_pwa_app = new Vue({
    el: '#basic_pwa_app',

    data: {
        db: null,
        uploadImage: {
            name: '',
            size: '',
            type: '',
            src: ''
        },
        dbImages: [],
        openImage: ''
    },
    beforeMount: function () {
        const that = this;

    },
    mounted: function () {
        const that = this;
        that.db = new Dexie("BasicPWA");
        that.db.version(1).stores({
            images: '++id,name'
        });
        that.db.open().then(() => {
            that.loadSavedImages();
        }).catch((e) => {
            console.error("Open failed: " + e.stack);
        })
    },
    methods: {
        saveFiles(event) {
            const that = this;
            //read image as base64
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = () => {
                that.uploadImage = {
                    name: event.target.files[0].name,
                    size: event.target.files[0].size,
                    type: event.target.files[0].type,
                    src: reader.result
                };
                console.log(that.uploadImage);
            };
            reader.onerror = error => console.log(error);
        },
        saveImageToDb() {
            const that = this;
            that.db.images.add(that.uploadImage).then(() => { alert("Image save"); });
            that.uploadImage = {
                name: "",
                size: 0,
                type: "",
                src: ""
            };
            that.loadSavedImages();
        },
        loadSavedImages() {
            const that = this;
            that.db.images.toArray().then((images) => {
                that.dbImages = images;
            });
        },
        loadImage(id) {
            const that = this;
            that.openImage = that.dbImages[id].src;
        },
        deleteImage(id) {
            const that = this;
            that.db.images.delete(id);
            that.loadSavedImages();
        }
    }
});