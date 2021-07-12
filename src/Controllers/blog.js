'use strict';
class Interface {
  constructor(model) {
    this.model = model;
  }

  read(_id) {
    if (_id) {
      return this.model.find({ _id });
    }
    return this.model.find({});
  }

  cerate(obg) {
    const blog = new this.model(obg);
    return blog.save();
  }

  update(_id, obj) {
    return this.model.findByIdAndUpdate(_id, obj, { new: true });
  }

  delete(_id) {
    this.model.findByIdAndDelete(_id);
    return;
  }
}

module.exports = Interface;