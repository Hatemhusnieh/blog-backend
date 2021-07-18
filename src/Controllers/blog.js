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
    obj.date = new Date().toLocaleTimeString();
    const blog = new this.model(obj);
    return blog.save();
  }

   async update(payload) {
    const blog= await this.model.findOne({_id:payload.id});
    if (blog.blogger == payload.blogger && blog.password == payload.password) {
    blog.content=payload.content;
    return blog.save();
    }
    return 'not authorized to update this blog';
  }

  async comment(payload) {
    const id = payload.id;
    const comment = {
      comment : payload.comment,
      commenter:  payload.commenter,
      date: new Date().toLocaleTimeString(),
    };
    const blog = await this.model.findOne({ _id: id });
    blog.comments.push(comment);
    return blog.save();
    // return this.model.findByIdAndUpdate(id, string, { new: true });
  }
  async like(payload){
    const blog = await this.model.findOne({_id:payload.id});
    blog.likes.push(payload.user);
    return blog.save();
  }

  async delete(payload) {
    const valid = await this.model.findOne({ _id: payload.id });
    if (valid.blogger == payload.blogger && valid.password == payload.password) {
      const deleted = this.model.findByIdAndDelete({ _id: payload.id });
      return deleted;
    }
    return 'not authorized to delete this blog';
  }
}

module.exports = Interface;