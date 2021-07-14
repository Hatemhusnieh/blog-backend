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

  update=async (_id, obj)=> {
    if (obj.comment) {
      const addComment = this.model.findOne(_id);
      addComment.comments.push(obj);
      addComment.save();
      return;
    }
    return this.model.findByIdAndUpdate(_id, obj, { new: true });
  }

  delete = async (payload) =>{
    // console.log(payload);
    const valid = await this.model.findOne({_id:payload.id});
    if (valid.blogger == payload.blogger && valid.password == payload.password) {
     const deleted=  this.model.findByIdAndDelete({_id:payload.id});
     return deleted;
    }
    return 'invalid username or password';
  }
}

module.exports = Interface;