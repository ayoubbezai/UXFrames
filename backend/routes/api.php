<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\CategoryController;

Route::apiResource('/projects', ProjectController::class);

// Project-specific categories
Route::get('/projects/{project}/categories', [CategoryController::class, 'index']);
Route::post('/projects/{project}/categories', [CategoryController::class, 'store']);

// Individual category operations
Route::apiResource('/categories', CategoryController::class)->except(['index', 'store']);