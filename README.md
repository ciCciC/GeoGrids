# Geo-Grids

One that started as a TenneT challenge that is currently continuing as an experiment.

This repository has two objectives, namely
- An application for interactive visualization of energy consumption on zipcode level along with electrical substation properties using open source data
  - [api](https://github.com/ciCciC/GeoGrids/tree/main/api)
  - [web](https://github.com/ciCciC/GeoGrids/tree/main/web)
- Grid optimization, estimating energy usage change direction over time utilizing Linear Multilevel Modeling
  - [notebooks](https://github.com/ciCciC/GeoGrids/tree/main/notebooks/grid_optimization)
- A function that can estimate the path and electrical substation for a given point of interest using open source data
  - [notebooks](https://github.com/ciCciC/GeoGrids/tree/main/notebooks/grid_reconstruction)


# Getting Started

## Prerequisite
- install miniforge
- create a Virtualenv or Conda environment
- enter from root the following cmd line for installation of required pkgs:
```commandline
pip install -r requirements.txt
```
- run application
```commandline
cd api
```
```commandline
python main.py
```

## API docs
```
http://127.0.0.1:8000/docs
```