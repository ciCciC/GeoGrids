# Grid Reconstruction

*"Open source data (power cables) suffers from missingness"*

... more details will follow soon 

## Open-source data
- Liander data is utilized for
  - [Estimation footprints for data compilation](https://github.com/ciCciC/GeoGrids/blob/main/notebooks/grid_reconstruction/compiling_footprint.ipynb)
  - [Reconstruction of lvc data that suffers from missingness](https://github.com/ciCciC/GeoGrids/blob/main/notebooks/grid_reconstruction/lvc_reconstructor.ipynb)

## Estimation footprints for data compilation
<p align='center'>
  <img width='50%' src="/asset/station_polygons.png">
</p>

| A                                                                                                                                                                              | B                                                                                   | C                                                                      | D                                                                   |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------------------------------------------------------------|---------------------------------------------------------------------|
| ![](/asset/p0.png)                                                                                                                                                             | ![](/asset/p1.png)                                                                  | ![](/asset/p2.png)                                                     | ![](/asset/p3.png)                                                  |
| Retrieves polygons (P) based on point of interest (POI) within a certain distance, along with the medium voltage cables (MS) that exist within the bounds of unary unions of P | Filters P given distance distribution between P and MS conditioned with a threshold | Filters P based on empirically selected degree centrality as threshold | Appends missing P (computed manually) to recover missing footprints |
