<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ScreenController;

Route::apiResource('/projects', ProjectController::class);
Route::apiResource('/screens', ScreenController::class);

// Categories routes - support both project-specific and general endpoints
Route::get('/categories', [CategoryController::class, 'getByProject']); // For frontend compatibility
Route::post('/categories', [CategoryController::class, 'storeGeneral']); // For frontend compatibility
Route::apiResource('/categories', CategoryController::class)->except(['index', 'store']);

// Project-specific categories (alternative routes)
Route::get('/projects/{project}/categories', [CategoryController::class, 'index']);
Route::post('/projects/{project}/categories', [CategoryController::class, 'store']);