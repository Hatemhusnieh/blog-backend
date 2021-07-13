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

  create(obj) {
    obj.date = new Date().toLocaleDateString();
    const blog = new this.model(obj);
    return blog.save();
  }

  update(_id, obj) {
    if(obj.comment){
      const addComment = this.model.findOne(_id);
      addComment.comments.push(obj);
      addComment.save();
      return;
    }
    return this.model.findByIdAndUpdate(_id, obj, { new: true });
  }

  delete(_id) {
    this.model.findByIdAndDelete(_id);
    return;
  }
}

module.exports = Interface;