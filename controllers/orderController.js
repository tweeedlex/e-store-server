const { Order, Item } = require("../models");
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

class OrderController {
  async add(req, res) {
    try {
      const { items, phone, email, telegram, userId } = req.body;

      if (!items || !phone) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const order = await Order.create({
        email,
        phone,
        telegram,
        items,
        userId: userId ? userId : "",
      });

      const orderedItems = await Item.findAll({
        where: { id: items.map((item) => item.id) },
      });

      console.log(orderedItems);
      await bot.telegram.sendMessage(
        process.env.CHAT_ID,
        `Нове замовлення! \n\nТелефон: ${phone}\nTelegram: ${telegram}\nEmail: ${email}\n\nЗамовлені товари: \n\n` +
          `${orderedItems.map((item) => {
            return `${item.name} - ${
              items.find((i) => i.id === item.id).amount
            } шт. \nІдентифікатор: ${item.id}\n\n`;
          })}
        `.replace(/,/g, "")
      );

      return res.status(200).json(order);
    } catch (e) {
      res.status(400).json(e);
      console.log(e);
    }
  }

  async complete(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: "No id" });
      }

      const { completed } = await Order.findOne({ where: { id } });
      if (completed) {
        return res.status(400).json({ message: "Order is already completed" });
      }

      await Order.update({ completed: true }, { where: { id } });
      return res.status(200).json({ message: "Order completed" });
    } catch (e) {
      res.status(400).json(e);
      console.log(e);
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: "No id" });
      }

      await Order.destroy({ where: { id } });
      return res.status(200).json({ message: "Order removed" });
    } catch (e) {
      res.status(400).json(e);
      console.log(e);
    }
  }

  async get(req, res) {
    try {
      let { page, limit, completed } = req.query;

      page = page || 1;
      limit = Number(limit) || 10;
      let offset = page * limit - limit;

      let orders = [];

      if (completed !== undefined) {
        completed = completed === "true" ? true : false;
        orders = await Order.findAndCountAll({
          where: { completed },
          limit,
          offset,
        });
      } else {
        orders = await Order.findAndCountAll({ limit, offset });
      }

      return res.status(200).json(orders);
    } catch (e) {
      res.status(400).json(e);
      console.log(e);
    }
  }

  async getUserOrders(req, res) {
    try {
      const { id } = req.user;
      const orders = await Order.findAll({ where: { userId: id } });
      return res.status(200).json(orders);
    } catch (e) {
      res.status(400).json(e);
      console.log(e);
    }
  }
}

module.exports = new OrderController();
