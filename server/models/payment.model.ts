import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPayment extends Document {
  sessionId: string;
  userId?: string;
  payment_info: object;
  annualPayment: boolean;
}

const paymentSchema = new Schema<IPayment>(
  {
    sessionId: {
     type: String,
     required: true
    },
    userId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
      // required: true
    },
    annualPayment: {
      type: Boolean,
      // required : true
    },
  },
  { timestamps: true }
);

const PaymentModel: Model<IPayment> = mongoose.model('Payment',paymentSchema);

export default PaymentModel;
