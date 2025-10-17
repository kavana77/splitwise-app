import env from "./utils/validation"
import express from 'express'
import cors from 'cors'
import userRouter from "./routes/userRoute"
import groupRouter from "./routes/groupRoute"
import expenseRouter from "./routes/expenseRoute"
import settlementRoute from "./routes/settlePaymentRoute"
import groupBalanceRoute from "./routes/groupBalanceRoute"
const app = express()

app.use(cors())
app.use(express.json())
const PORT = env.PORT
app.get("/", (req, res) => {
  console.log(" Root route hit");
  res.send("API is running!");
});
app.use('/api/check',groupBalanceRoute)
app.use('/api/add', groupRouter, expenseRouter,settlementRoute, userRouter)

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})