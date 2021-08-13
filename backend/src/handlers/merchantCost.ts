import express, { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { IndustryValues, MerchantCostStore } from '../models/merchantCost';
import { verifyAdminToken, verifyToken } from '../helpers/tokenHelper';
import { runInterpolation } from '../helpers/calculationHelper';

const store = new MerchantCostStore();

const uploadFile = async (_req: Request, res: Response) => {
  if (!_req.files || Object.keys(_req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const costCsv = _req.files.file as UploadedFile;
  const uploadPath = '/backend/uploads/merchant_cost.csv';

  //Save a copy of the file on backend/upload, this will be also used to import to db
  costCsv.mv(uploadPath, function (err: any) {
    if (err) return res.status(500).send(err);
  });

  const result = await store.addFile();

  res.json(result);
};

const calculate = async (_req: Request, res: Response) => {
  const calculationParams: IndustryValues = {
    industry: _req.body.industry,
    transaction_volume: _req.body.transaction_volume,
    transaction_count: _req.body.transaction_count
  };

  const terminal = await store.getIndustryTypeValue(
    calculationParams.industry,
    'TERMINAL'
  );
  const transactionVolume = await store.getIndustryTypeValue(
    calculationParams.industry,
    'TRANSACTION_VOLUME',
    calculationParams.transaction_volume
  );
  const transactionCount = await store.getIndustryTypeValue(
    calculationParams.industry,
    'TRANSACTION_COUNT',
    calculationParams.transaction_count
  );

  if (!terminal) {
    res.status(404).json('No values found for industry supplied');
    return;
  }

  const terminalPrice = terminal.price;
  //Set the exact price if it has an exact price and if not run the values through the runInterpolation function to get the value if it can be interpolated
  const transactionVolumePrice = transactionVolume.exact_type_price
    ? transactionVolume.exact_type_price[1]
    : runInterpolation(transactionVolume, calculationParams.transaction_volume);
  const transactionCountPrice = transactionCount.exact_type_price
    ? transactionCount.exact_type_price[1]
    : runInterpolation(transactionCount, calculationParams.transaction_count);

  //Only sum if all values are true
  if (terminalPrice && transactionVolumePrice && transactionCountPrice) {
    const total = (
      terminalPrice +
      transactionVolumePrice +
      transactionCountPrice
    ).toFixed(2);

    return res.json(total);
  } else {
    res.json('Values for parameters supplied not found');
  }
};

const merchantCostRoutes = (app: express.Application) => {
  app.post('/api/upload', verifyAdminToken, uploadFile);
  app.post('/api/calculate', verifyToken, calculate);
};

export default merchantCostRoutes;
